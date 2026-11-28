namespace GeoEnergy.Api.Models;

public class Notification
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int DocumentId { get; set; }

    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}