namespace GeoEnergy.Api.DTOs.Documents;

public class DocumentQueryParams
{
    public string? Search { get; set; }

    public string? Status { get; set; }

    public string? Department { get; set; }

    public string? DocumentType { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}