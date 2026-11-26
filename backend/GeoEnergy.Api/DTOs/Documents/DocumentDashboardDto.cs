
namespace GeoEnergy.Api.DTOs.Documents;

public class DocumentDashboardDto
{
    public int TotalDocuments { get; set; }

    public int PendingApproval { get; set; }

    public int Approved { get; set; }

    public int Rejected { get; set; }

    public List<DocumentListItemDto> RecentDocuments { get; set; } = new();
}
