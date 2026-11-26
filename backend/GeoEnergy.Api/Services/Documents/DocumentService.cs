using GeoEnergy.Api.Data;
using GeoEnergy.Api.DTOs.Documents;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using GeoEnergy.Api.Models;

namespace GeoEnergy.Api.Services.Documents;

public class DocumentService : IDocumentService
{
    private readonly ApplicationDbContext _context;
private readonly IWebHostEnvironment _environment;

public DocumentService(
    ApplicationDbContext context,
    IWebHostEnvironment environment)
{
    _context = context;
    _environment = environment;
}

    public async Task<PagedResult<DocumentListItemDto>> GetDocumentsAsync(
        DocumentQueryParams query,
        int userId,
        string role)
    {
        // Start with all documents.
        var documents = _context.Documents
            .AsNoTracking()
            .AsQueryable();

        // Apply role-based access.
        if (role == "Engineer")
        {
            documents = documents.Where(d => d.UploadedById == userId);
        }
        else if (role != "Manager")
        {
            throw new UnauthorizedAccessException(
                "You are not authorized to view documents.");
        }

        // Search by title.
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            documents = documents.Where(d =>
                d.Title.Contains(search));
        }

        // Filter by status.
        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            documents = documents.Where(d =>
                d.Status == query.Status);
        }

        // Filter by department.
        if (!string.IsNullOrWhiteSpace(query.Department))
        {
            documents = documents.Where(d =>
                d.Department == query.Department);
        }

        // Filter by document type.
        if (!string.IsNullOrWhiteSpace(query.DocumentType))
        {
            documents = documents.Where(d =>
                d.DocumentType == query.DocumentType);
        }

        // Get total count before pagination.
        var totalCount = await documents.CountAsync();

        // Validate pagination.
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        // Retrieve the requested page.
        var items = await documents
            .OrderByDescending(d => d.UploadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(d => new DocumentListItemDto
            {
                Id = d.Id,
                Title = d.Title,
                Department = d.Department,
                DocumentType = d.DocumentType,
                Status = d.Status,
                UploadedByName = d.UploadedBy.FullName,
                UploadedAt = d.UploadedAt,
                ReviewedAt = d.ReviewedAt
            })
            .ToListAsync();

        return new PagedResult<DocumentListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<DocumentDetailsDto?> GetDocumentByIdAsync(
        int documentId,
        int userId,
        string role)
    {
        var document = await _context.Documents
            .AsNoTracking()
            .Include(d => d.UploadedBy)
            .Include(d => d.ReviewedBy)
            .Include(d => d.Versions)
                .ThenInclude(v => v.UploadedBy)
            .Include(d => d.History)
                .ThenInclude(h => h.User)
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document == null)
            return null;

        // Enforce document ownership.
        if (role == "Engineer" && document.UploadedById != userId)
            return null;

        if (role != "Engineer" && role != "Manager")
            return null;

        return new DocumentDetailsDto
        {
            Id = document.Id,
            Title = document.Title,
            Department = document.Department,
            DocumentType = document.DocumentType,
            Status = document.Status,

            UploadedByName = document.UploadedBy.FullName,
            UploadedAt = document.UploadedAt,

            ReviewedByName = document.ReviewedBy?.FullName,
            ReviewedAt = document.ReviewedAt,
            RejectionComment = document.RejectionComment,

            Versions = document.Versions
                .OrderBy(v => v.VersionNumber)
                .Select(v => new DocumentVersionDto
                {
                    Id = v.Id,
                    VersionNumber = v.VersionNumber,
                    OriginalFileName = v.OriginalFileName,
                    UploadedByName = v.UploadedBy.FullName,
                    UploadedAt = v.UploadedAt
                })
                .ToList(),

            History = document.History
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new DocumentHistoryDto
                {
                    Id = h.Id,
                    Action = h.Action,
                    Comment = h.Comment,
                    UserFullName = h.User.FullName,
                    CreatedAt = h.CreatedAt
                })
                .ToList()
        };
    }

    public async Task<DocumentDetailsDto> UploadDocumentAsync(
    UploadDocumentRequest request,
    int userId)
{
    if (request.File == null)
        throw new ArgumentException("A file is required.");

    var file = request.File;

    // Validate file size: maximum 10 MB.
    const long maxFileSize = 10 * 1024 * 1024;

    if (file.Length == 0)
        throw new ArgumentException("The uploaded file is empty.");

    if (file.Length > maxFileSize)
        throw new ArgumentException("Maximum file size is 10 MB.");

    // Validate metadata.
    if (string.IsNullOrWhiteSpace(request.Title))
        throw new ArgumentException("Document title is required.");

    if (string.IsNullOrWhiteSpace(request.DocumentType))
        throw new ArgumentException("Document type is required.");

    // Find the authenticated uploader.
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Id == userId);

    if (user == null)
        throw new UnauthorizedAccessException("User not found.");

    // Read the file signature.
    await using var inputStream = file.OpenReadStream();

    var header = new byte[12];
    var bytesRead = await inputStream.ReadAsync(header.AsMemory());

    var extension = GetFileExtension(header, bytesRead);

    if (extension == null)
        throw new ArgumentException(
            "Only PDF, JPEG, PNG and WebP files are allowed.");

    // Generate a unique server-side filename.
    var storedFileName = $"{Guid.NewGuid():N}{extension}";

    var uploadDirectory = Path.Combine(
        _environment.ContentRootPath,
        "Uploads");

    Directory.CreateDirectory(uploadDirectory);

    var fullPath = Path.Combine(uploadDirectory, storedFileName);

    var relativePath = Path.Combine("Uploads", storedFileName);

    await using var transaction =
        await _context.Database.BeginTransactionAsync();

    try
    {
        // Save the physical file.
        inputStream.Position = 0;

        await using (var outputStream = new FileStream(
            fullPath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None,
            81920,
            FileOptions.Asynchronous))
        {
            await inputStream.CopyToAsync(outputStream);
        }

        var now = DateTime.UtcNow;

        // Create the document.
        var document = new Document
        {
            Title = request.Title.Trim(),
            Department = user.Department,
            DocumentType = request.DocumentType.Trim(),
            Status = "Pending Approval",
            UploadedById = user.Id,
            UploadedBy = user,
            UploadedAt = now
        };

        // Create the first version.
        var version = new DocumentVersion
        {
            VersionNumber = 1,
            FilePath = relativePath,
            OriginalFileName = Path.GetFileName(file.FileName),
            UploadedById = user.Id,
            UploadedBy = user,
            UploadedAt = now
        };

        // Record the upload in document history.
        var history = new DocumentHistory
        {
            UserId = user.Id,
            User = user,
            Action = "Uploaded",
            Comment = "Document uploaded. Version 1.",
            CreatedAt = now
        };

        document.Versions.Add(version);
        document.History.Add(history);

        _context.Documents.Add(document);

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        // Return document details.
        return new DocumentDetailsDto
        {
            Id = document.Id,
            Title = document.Title,
            Department = document.Department,
            DocumentType = document.DocumentType,
            Status = document.Status,
            UploadedByName = user.FullName,
            UploadedAt = document.UploadedAt,

            Versions = new List<DocumentVersionDto>
            {
                new()
                {
                    Id = version.Id,
                    VersionNumber = version.VersionNumber,
                    OriginalFileName = version.OriginalFileName,
                    UploadedByName = user.FullName,
                    UploadedAt = version.UploadedAt
                }
            },

            History = new List<DocumentHistoryDto>
            {
                new()
                {
                    Id = history.Id,
                    Action = history.Action,
                    Comment = history.Comment,
                    UserFullName = user.FullName,
                    CreatedAt = history.CreatedAt
                }
            }
        };
    }
    catch
    {
        await transaction.RollbackAsync();

        // Remove the physical file if database saving fails.
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        throw;
    }
}
private static string? GetFileExtension(
    byte[] header,
    int bytesRead)
{
    // PDF: %PDF-
    if (bytesRead >= 5 &&
        Encoding.ASCII.GetString(header, 0, 5) == "%PDF-")
        return ".pdf";

    // JPEG
    if (bytesRead >= 3 &&
        header[0] == 0xFF &&
        header[1] == 0xD8 &&
        header[2] == 0xFF)
        return ".jpg";

    // PNG
    if (bytesRead >= 8 &&
        header[0] == 0x89 &&
        header[1] == 0x50 &&
        header[2] == 0x4E &&
        header[3] == 0x47 &&
        header[4] == 0x0D &&
        header[5] == 0x0A &&
        header[6] == 0x1A &&
        header[7] == 0x0A)
        return ".png";

    // WebP: RIFF....WEBP
    if (bytesRead >= 12 &&
        Encoding.ASCII.GetString(header, 0, 4) == "RIFF" &&
        Encoding.ASCII.GetString(header, 8, 4) == "WEBP")
        return ".webp";

    return null;
}
}