
namespace GeoEnergy.Api.Services.Documents;
using GeoEnergy.Api.DTOs.Documents;
public interface IDocumentService
{
    Task<PagedResult<DocumentListItemDto>> GetDocumentsAsync(
        DocumentQueryParams query,
        int userId,
        string role);

    Task<DocumentDetailsDto?> GetDocumentByIdAsync(
        int documentId,
        int userId,
        string role);

        Task<DocumentDetailsDto> UploadDocumentAsync(
    UploadDocumentRequest request,
    int userId);
}