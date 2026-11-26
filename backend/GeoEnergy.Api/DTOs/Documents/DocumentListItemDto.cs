namespace GeoEnergy.Api.DTOs.Documents;

public class DocumentListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public string UploadedByName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }
}