
namespace GeoEnergy.Api.Models;

public class Document
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending Approval";

    public int UploadedById { get; set; }
    public User UploadedBy { get; set; } = null!;

    public int? ReviewedById { get; set; }
    public User? ReviewedBy { get; set; }

    public DateTime UploadedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public string? RejectionComment { get; set; }

    public ICollection<DocumentVersion> Versions { get; set; }
        = new List<DocumentVersion>();

    public ICollection<DocumentHistory> History { get; set; }
        = new List<DocumentHistory>();
}
