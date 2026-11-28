
import { useEffect, useState } from "react";
import { Search, FileText, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDocuments } from "../../api/documentApi";
import { Link } from "react-router-dom";
import type {
  DocumentItem,
  DocumentsResponse,
} from "../../api/documentApi";
import "../engineer/MyDocumentsPage.css";

const PAGE_SIZE = 10;

const ManagerDocumentsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [department, setDepartment] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const result: DocumentsResponse = await getDocuments({
          search: search.trim() || undefined,
          status: status || undefined,
          documentType: documentType || undefined,
          department: department.trim() || undefined,
          page,
          pageSize: PAGE_SIZE,
        });

        if (!cancelled) {
          setDocuments(result.items);
          setTotalPages(result.totalPages);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error("Failed to load manager documents:", err);

        if (!cancelled) {
          setError(t("managerDocuments.loadError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timeout = setTimeout(fetchDocuments, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, status, documentType, department, page, refreshKey, t]);

  const handleFilterChange = (
    value: string,
    type: "status" | "documentType"
  ) => {
    setPage(1);

    if (type === "status") {
      setStatus(value);
    } else {
      setDocumentType(value);
    }
  };

  const getStatusClass = (value: string) => {
    switch (value.toLowerCase()) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "pending approval":
        return "pending";
      default:
        return "default";
    }
  };

  const getStatusLabel = (value: string) => {
    switch (value.toLowerCase()) {
      case "approved":
        return t("status.approved");
      case "rejected":
        return t("status.rejected");
      case "pending approval":
        return t("status.pending");
      default:
        return value;
    }
  };

  const getDocumentTypeLabel = (value: string) => {
    const key = value.toLowerCase();

    if (["invoice", "contract", "report", "other"].includes(key)) {
      return t(`documents.${key}`);
    }

    return value;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(
      isArabic ? "ar-EG" : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  return (
    <div className="my-documents-page">
      <div className="documents-heading">
        <div>
          <span className="page-eyebrow">
            {t("managerDocuments.eyebrow")}
          </span>

          <h1>{t("managerDocuments.title")}</h1>

          <p>{t("managerDocuments.description")}</p>
        </div>

        <div className="documents-total">
          <FileText size={20} />

          <div>
            <strong>{totalCount}</strong>
            <span>{t("managerDocuments.totalDocuments")}</span>
          </div>
        </div>
      </div>

      <div className="documents-toolbar">
        <div className="documents-search">
          <Search size={18} />

          <input
            type="text"
            placeholder={t("managerDocuments.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={status}
          onChange={(e) => handleFilterChange(e.target.value, "status")}
          aria-label={t("documents.filterByStatus")}
        >
          <option value="">{t("documents.allStatuses")}</option>
          <option value="Pending Approval">{t("status.pending")}</option>
          <option value="Approved">{t("status.approved")}</option>
          <option value="Rejected">{t("status.rejected")}</option>
        </select>

        <select
          value={documentType}
          onChange={(e) =>
            handleFilterChange(e.target.value, "documentType")
          }
          aria-label={t("documents.documentType")}
        >
          <option value="">{t("documents.allDocumentTypes")}</option>
          <option value="Invoice">{t("documents.invoice")}</option>
          <option value="Contract">{t("documents.contract")}</option>
          <option value="Report">{t("documents.report")}</option>
          <option value="Other">{t("documents.other")}</option>
        </select>

        <input
          className="manager-department-filter"
          type="text"
          placeholder={t("managerDocuments.departmentPlaceholder")}
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
          aria-label={t("common.department")}
        />
      </div>

      <div className="documents-table-card">
        {loading ? (
          <div className="documents-state">
            <RefreshCw className="spin" size={24} />
            <p>{t("documents.loadingDocuments")}</p>
          </div>
        ) : error ? (
          <div className="documents-state error-state">
            <p>{error}</p>

            <button onClick={() => setRefreshKey((key) => key + 1)}>
              {t("common.tryAgain")}
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="documents-state">
            <FileText size={36} />

            <h3>{t("documents.emptyTitle")}</h3>

            <p>{t("documents.emptyDescription")}</p>
          </div>
        ) : (
          <div className="documents-table-wrapper">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>{t("common.document")}</th>
                  <th>{t("documents.documentType")}</th>
                  <th>{t("common.department")}</th>
                  <th>{t("managerDocuments.uploadedBy")}</th>
                  <th>{t("documents.uploadedAt")}</th>
                  <th>{t("common.status")}</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="document-title-cell">
                        <div className="document-file-icon">
                          <FileText size={18} />
                        </div>

                        <div>
                        <Link
  to={`/manager/documents/${doc.id}`}
  className="document-details-link"
>
  <strong>{doc.title}</strong>
</Link>
                          <span dir="ltr">DOC-{doc.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{getDocumentTypeLabel(doc.documentType)}</td>

                    <td>{doc.department}</td>

                    <td>{doc.uploadedByName}</td>

                    <td>{formatDate(doc.uploadedAt)}</td>

                    <td>
                      <span
                        className={`document-status ${getStatusClass(doc.status)}`}
                      >
                        <span className="status-dot" />
                        {getStatusLabel(doc.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && totalCount > 0 && (
        <div className="documents-pagination">
          <span>
            {t("documents.showingPage")} {page} {t("documents.of")}{" "}
            {totalPages}
          </span>

          <div>
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              {t("documents.previous")}
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              {t("documents.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDocumentsPage;
