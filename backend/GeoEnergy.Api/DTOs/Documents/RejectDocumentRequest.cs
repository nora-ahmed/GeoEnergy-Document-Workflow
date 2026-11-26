using System.ComponentModel.DataAnnotations;

namespace GeoEnergy.Api.DTOs.Documents;

public class RejectDocumentRequest
{
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string Comment { get; set; } = string.Empty;
}