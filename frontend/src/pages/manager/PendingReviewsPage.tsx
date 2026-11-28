
import { useEffect, useState } from "react";
import { Search, FileText, RefreshCw, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDocuments } from "../../api/documentApi";
import type {
  DocumentItem,
  DocumentsResponse,
} from "../../api/documentApi";
import "./PendingReviewsPage.css";

const PAGE_SIZE = 10;

const PendingReviewsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [department, setDepartment] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPendingDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const result: DocumentsResponse = await getDocuments({
          search: search.trim() || undefined,
          status: "Pending Approval",
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
        console.error("Failed to load pending reviews:", err);

        if (!cancelled) {
          setError(t("pendingReviews.loadError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timeout = setTimeout(fetchPendingDocuments, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, documentType, department, page, refreshKey, t]);

  const getDocumentTypeLabel = (value: string) => {
    const key = value.toLowerCase();

    if (["invoice", "contract", "report", "other"].includes(key)) {
      return t(`documents.${key}`);
    }

    return value;
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <div className="my-documents-page pending-reviews-page">
      <div className="documents-heading">
        <div>
          <span className="page-eyebrow">
            {t("pendingReviews.eyebrow")}
          </span>

          <h1>{t("pendingReviews.title")}</h1>

          <p>{t("pendingReviews.description")}</p>
        </div>

        <div className="documents-total pending-reviews-total">
          <FileText size={20} />

          <div>
            <strong>{totalCount}</strong>
            <span>{t("pendingReviews.pendingCount")}</span>
          </div>
        </div>
      </div>

      <div className="documents-toolbar">
        <div className="documents-search">
          <Search size={18} />

          <input
            type="text"
            placeholder={t("pendingReviews.searchPlaceholder")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={documentType}
          onChange={(event) => {
            setDocumentType(event.target.value);
            setPage(1);
          }}
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
          onChange={(event) => {
            setDepartment(event.target.value);
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
            <h3>{t("pendingReviews.emptyTitle")}</h3>
            <p>{t("pendingReviews.emptyDescription")}</p>
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
                  <th>{t("common.actions")}</th>
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
                      <span className="document-status pending">
                        <span className="status-dot" />
                        {t("status.pending")}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/manager/documents/${doc.id}`}
                        className="pending-review-button"
                      >
                        <Eye size={16} />
                        {t("pendingReviews.review")}
                      </Link>
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

export default PendingReviewsPage;
