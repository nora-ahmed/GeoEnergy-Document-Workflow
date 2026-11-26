using System.Security.Claims;
using GeoEnergy.Api.DTOs.Documents;
using GeoEnergy.Api.Services.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GeoEnergy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments(
        [FromQuery] DocumentQueryParams query)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var role = User.FindFirstValue(ClaimTypes.Role)!;

        try
        {
            var result = await _documentService.GetDocumentsAsync(
                query, userId, role);

            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDocumentById(int id)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var role = User.FindFirstValue(ClaimTypes.Role)!;

        var document = await _documentService.GetDocumentByIdAsync(
            id, userId, role);

        if (document == null)
            return NotFound(new { message = "Document not found." });

        return Ok(document);
    }

    [HttpPost("upload")]
[Authorize(Roles = "Engineer")]
[Consumes("multipart/form-data")]
[RequestSizeLimit(11 * 1024 * 1024)]
public async Task<IActionResult> UploadDocument(
    [FromForm] UploadDocumentRequest request)
{
    var userId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    try
    {
        var result = await _documentService.UploadDocumentAsync(
            request, userId);

        return CreatedAtAction(
            nameof(GetDocumentById),
            new { id = result.Id },
            result);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException)
    {
        return Unauthorized();
    }
}
}