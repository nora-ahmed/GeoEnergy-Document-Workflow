import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getDocumentDetails,
} from "../../api/documentApi";
import type {
  DocumentDetails,
} from "../../api/documentApi";
import "./DocumentDetailsPage.css";

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      if (!id || !Number.isInteger(Number(id))) {
        setError(t("documentDetails.invalidId"));
        setLoading(false);
        return;
      }

      try {
        const result = await getDocumentDetails(Number(id));

        if (!cancelled) {
          setDocument(result);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load document details:", err);

        if (!cancelled) {
          setError(t("documentDetails.loadError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
    };
  }, [id, refreshKey, t]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

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

  const getActionLabel = (action: string) => {
    const key = action.toLowerCase().replace(/[\s_-]/g, "");

    const actionKeys: Record<string, string> = {
      uploaded: "uploaded",
      submitted: "submitted",
      resubmitted: "resubmitted",
      approved: "approved",
      rejected: "rejected",
    };

    const translationKey = actionKeys[key];
    return translationKey
      ? t(`documentDetails.actions.${translationKey}`)
      : action;
  };

  return (
    <div className="document-details-page">
      <Link to="/engineer/documents" className="details-back-link">
        <ArrowLeft size={18} />
        {t("documentDetails.backToDocuments")}
      </Link>

      {loading ? (
        <div className="details-state">
          <RefreshCw className="spin" size={24} />
          <p>{t("documentDetails.loading")}</p>
        </div>
      ) : error ? (
        <div className="details-state details-error">
          <p>{error}</p>
       <button
  onClick={() => {
    setLoading(true);
    setError("");
    setRefreshKey((value) => value + 1);
  }}
>
  {t("common.tryAgain")}
</button>
        </div>
      ) : document ? (
        <>
          <header className="details-heading">
            <div className="details-title-icon">
              <FileText size={24} />
            </div>

            <div className="details-heading-text">
              <span className="page-eyebrow">
                {t("documentDetails.eyebrow")}
              </span>
              <h1>{document.title}</h1>
              <p dir="ltr">DOC-{document.id}</p>
            </div>

            <span
              className={`details-status ${getStatusClass(document.status)}`}
            >
              {getStatusLabel(document.status)}
            </span>
          </header>

          <section className="details-card">
            <h2>{t("documentDetails.information")}</h2>

            <div className="details-info-grid">
              <div>
                <span>{t("documents.documentType")}</span>
                <strong>{document.documentType}</strong>
              </div>
              <div>
                <span>{t("common.department")}</span>
                <strong>{document.department}</strong>
              </div>
              <div>
                <span>{t("documents.uploadedBy")}</span>
                <strong>{document.uploadedByName}</strong>
              </div>
              <div>
                <span>{t("documents.uploadedAt")}</span>
                <strong>{formatDate(document.uploadedAt)}</strong>
              </div>
              <div>
                <span>{t("documentDetails.reviewedBy")}</span>
                <strong>{document.reviewedByName || t("common.notAvailable")}</strong>
              </div>
              <div>
                <span>{t("documents.reviewedAt")}</span>
                <strong>
                  {document.reviewedAt
                    ? formatDate(document.reviewedAt)
                    : t("common.notAvailable")}
                </strong>
              </div>
            </div>

            {document.rejectionComment && (
              <div className="details-rejection">
                <strong>{t("documentDetails.rejectionComment")}</strong>
                <p>{document.rejectionComment}</p>
              </div>
            )}
          </section>

          <section className="details-card">
            <div className="details-section-heading">
              <h2>{t("documentDetails.versions")}</h2>
              <span>{document.versions.length}</span>
            </div>

            {document.versions.length === 0 ? (
              <p className="details-muted">{t("documentDetails.noVersions")}</p>
            ) : (
              <div className="details-list">
                {document.versions.map((version) => (
                  <div className="details-list-item" key={version.id}>
                    <div className="details-list-icon">
                      <FileText size={18} />
                    </div>
                    <div className="details-list-content">
                      <strong>
                        {t("documentDetails.version")} {version.versionNumber}
                      </strong>
                      <span>{version.originalFileName}</span>
                      <small>
                        {version.uploadedByName} · {formatDate(version.uploadedAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="details-card">
            <div className="details-section-heading">
              <h2>{t("documentDetails.history")}</h2>
              <span>{document.history.length}</span>
            </div>

            {document.history.length === 0 ? (
              <p className="details-muted">{t("documentDetails.noHistory")}</p>
            ) : (
              <div className="details-list">
                {document.history.map((item) => (
                  <div className="details-list-item" key={item.id}>
                    <div className="details-history-dot" />
                    <div className="details-list-content">
                      <strong>{getActionLabel(item.action)}</strong>
                      <span>
                        {item.userFullName} · {formatDate(item.createdAt)}
                      </span>
                      {item.comment && <p>{item.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
};

export default DocumentDetailsPage;