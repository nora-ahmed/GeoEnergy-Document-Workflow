namespace GeoEnergy.Api.DTOs.Documents;

public class DocumentDetailsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public string UploadedByName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionComment { get; set; }

    public List<DocumentVersionDto> Versions { get; set; } = new();
    public List<DocumentHistoryDto> History { get; set; } = new();
}

public class DocumentVersionDto
{
    public int Id { get; set; }
    public int VersionNumber { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string UploadedByName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}

public class DocumentHistoryDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}