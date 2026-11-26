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

[HttpPost("{id:int}/approve")]
[Authorize(Roles = "Manager")]
public async Task<IActionResult> ApproveDocument(int id)
{
    var managerId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    try
    {
        var document = await _documentService.ApproveDocumentAsync(
            id, managerId);

        if (document == null)
            return NotFound(new { message = "Document not found." });

        return Ok(document);
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new { message = ex.Message });
    }
}

[HttpPost("{id:int}/reject")]
[Authorize(Roles = "Manager")]
public async Task<IActionResult> RejectDocument(
    int id,
    [FromBody] RejectDocumentRequest request)
{
    var managerId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    try
    {
        var document = await _documentService.RejectDocumentAsync(
            id, managerId, request.Comment);

        if (document == null)
            return NotFound(new { message = "Document not found." });

        return Ok(document);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new { message = ex.Message });
    }
}

[HttpPost("{id:int}/resubmit")]
[Authorize(Roles = "Engineer")]
[Consumes("multipart/form-data")]
[RequestSizeLimit(11 * 1024 * 1024)]
public async Task<IActionResult> ResubmitDocument(
    int id,
    [FromForm] UploadDocumentRequest request)
{
    var engineerId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    try
    {
        var document = await _documentService.ResubmitDocumentAsync(
            id, engineerId, request);

        if (document == null)
            return NotFound(new { message = "Document not found." });

        return Ok(document);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException)
    {
        return Forbid();
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new { message = ex.Message });
    }
}

}