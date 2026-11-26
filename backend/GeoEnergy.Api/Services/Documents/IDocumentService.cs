
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

    Task<DocumentDetailsDto?> ApproveDocumentAsync(
    int documentId,
    int managerId);

Task<DocumentDetailsDto?> RejectDocumentAsync(
    int documentId,
    int managerId,
    string comment);
}