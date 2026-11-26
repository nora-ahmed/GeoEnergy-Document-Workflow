
namespace GeoEnergy.Api.Models;

public class DocumentHistory
{
    public int Id { get; set; }

    public int DocumentId { get; set; }
    public Document Document { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Action { get; set; } = string.Empty;
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
}
