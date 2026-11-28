namespace GeoEnergy.Api.Models;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;

    public ICollection<Document> UploadedDocuments { get; set; }
        = new List<Document>();

    public ICollection<DocumentHistory> HistoryEntries { get; set; }
        = new List<DocumentHistory>();

        public ICollection<Notification> Notifications { get; set; }
    = new List<Notification>();
}