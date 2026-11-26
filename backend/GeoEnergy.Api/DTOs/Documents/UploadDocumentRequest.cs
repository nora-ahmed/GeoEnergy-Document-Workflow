using System.ComponentModel.DataAnnotations;

namespace GeoEnergy.Api.DTOs.Documents;

public class UploadDocumentRequest
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string DocumentType { get; set; } = string.Empty;

    [Required]
    public IFormFile? File { get; set; }
}