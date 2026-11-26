
import api from "./axios";

export interface UploadedDocument {
  id: number;
  title: string;
  department: string;
  documentType: string;
  status: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface UploadDocumentRequest {
  title: string;
  documentType: string;
  file: File;
}


export const uploadDocument = async (
  document: UploadDocumentRequest
): Promise<UploadedDocument> => {
  const formData = new FormData();

  formData.append("Title", document.title);
  formData.append("DocumentType", document.documentType);
  formData.append("File", document.file);

  const response = await api.post<UploadedDocument>(
    "/Documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export interface DocumentItem {
  id: number;
  title: string;
  department: string;
  documentType: string;
  status: string;
  uploadedByName: string;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface DocumentsResponse {
  items: DocumentItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DocumentsParams {
  search?: string;
  status?: string;
  department?: string;
  documentType?: string;
  page?: number;
  pageSize?: number;
}

export const getDocuments = async (
  params: DocumentsParams = {}
): Promise<DocumentsResponse> => {
  const response = await api.get<DocumentsResponse>("/Documents", {
    params,
  });

  return response.data;
};
export interface DashboardData {
  totalDocuments: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  recentDocuments: DocumentItem[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>("/Documents/dashboard");
  return response.data;
};