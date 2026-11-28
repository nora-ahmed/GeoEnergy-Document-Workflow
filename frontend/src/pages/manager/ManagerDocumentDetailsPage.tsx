
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getDocumentDetails,
  previewDocumentVersion,
  downloadDocumentVersion,
  approveDocument,
  rejectDocument,
} from "../../api/documentApi";

import type { DocumentDetails } from "../../api/documentApi";
import "./ManagerDocumentDetailsPage.css";

const ManagerDocumentDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [processing, setProcessing] = useState(false);

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewLoading, setPreviewLoading] = useState<number | null>(null);
  const [downloadingVersion, setDownloadingVersion] = useState<number | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      try {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
          await Promise.resolve();

          if (!cancelled) {
            setError(t("documentDetails.invalidId"));
            setLoading(false);
          }

          return;
        }

        const result = await getDocumentDetails(Number(id));

        if (!cancelled) {
          setDocument(result);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load manager document:", err);

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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const handleApprove = async () => {
    if (!document) return;

    setProcessing(true);
    setActionError("");
    setActionMessage("");

    try {
      await approveDocument(document.id);

      setActionMessage(t("managerReview.approveSuccess"));
      setLoading(true);
      setRefreshKey((value) => value + 1);
    } catch (err) {
      console.error("Failed to approve document:", err);
      setActionError(t("managerReview.approveError"));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!document) return;

    if (!rejectionComment.trim()) {
      setActionError(t("managerReview.commentRequired"));
      return;
    }

    setProcessing(true);
    setActionError("");
    setActionMessage("");

    try {
      await rejectDocument(document.id, rejectionComment.trim());

      setActionMessage(t("managerReview.rejectSuccess"));
      setRejectionComment("");
      setShowRejectForm(false);
      setLoading(true);
      setRefreshKey((value) => value + 1);
    } catch (err) {
      console.error("Failed to reject document:", err);
      setActionError(t("managerReview.rejectError"));
    } finally {
      setProcessing(false);
    }
  };

  const handlePreview = async (versionId: number, fileName: string) => {
    setPreviewLoading(versionId);
    setActionError("");

    try {
      const blob = await previewDocumentVersion(versionId);

      const isSupported =
        blob.type === "application/pdf" ||
        blob.type.startsWith("image/") ||
        /\.(pdf|jpe?g|png|webp)$/i.test(fileName);

      if (!isSupported) {
        setActionError(t("documentActions.noPreview"));
        return;
      }

      const url = URL.createObjectURL(blob);
      setPreviewName(fileName);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Failed to preview document:", err);
      setActionError(t("documentActions.previewError"));
    } finally {
      setPreviewLoading(null);
    }
  };

  const handleDownload = async (versionId: number, fileName: string) => {
    setDownloadingVersion(versionId);
    setActionError("");

    try {
      const blob = await downloadDocumentVersion(versionId);
      const url = URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download document:", err);
      setActionError(t("documentActions.downloadError"));
    } finally {
      setDownloadingVersion(null);
    }
  };

  const isPending =
    document?.status.toLowerCase() === "pending approval";

  return (
    <div className="document-details-page manager-document-details">
      <Link to="/manager/documents" className="details-back-link">
        <ArrowLeft size={18} />
        {t("managerReview.backToDocuments")}
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
                {t("managerReview.eyebrow")}
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

          {actionMessage && (
            <div className="document-action-success">
              {actionMessage}
            </div>
          )}

          {actionError && (
            <div className="document-action-error">
              {actionError}
            </div>
          )}

          {isPending && (
            <section className="details-card manager-review-card">
              <h2>{t("managerReview.reviewDocument")}</h2>

              <p>{t("managerReview.reviewDescription")}</p>

              {!showRejectForm ? (
                <div className="manager-review-actions">
                  <button
                    className="manager-approve-button"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    {processing ? (
                      <RefreshCw size={17} className="spin" />
                    ) : (
                      <CheckCircle size={17} />
                    )}
                    {t("managerReview.approve")}
                  </button>

                  <button
                    className="manager-reject-button"
                    onClick={() => {
                      setShowRejectForm(true);
                      setActionError("");
                    }}
                    disabled={processing}
                  >
                    <XCircle size={17} />
                    {t("managerReview.reject")}
                  </button>
                </div>
              ) : (
                <div className="manager-rejection-form">
                  <label htmlFor="rejection-comment">
                    {t("managerReview.rejectionComment")}
                  </label>

                  <textarea
                    id="rejection-comment"
                    value={rejectionComment}
                    onChange={(event) =>
                      setRejectionComment(event.target.value)
                    }
                    placeholder={t("managerReview.commentPlaceholder")}
                    rows={4}
                    maxLength={1000}
                  />

                  <div className="manager-review-actions">
                    <button
                      className="manager-reject-button"
                      onClick={handleReject}
                      disabled={processing || !rejectionComment.trim()}
                    >
                      {processing ? (
                        <RefreshCw size={17} className="spin" />
                      ) : (
                        <XCircle size={17} />
                      )}
                      {t("managerReview.confirmReject")}
                    </button>

                    <button
                      className="manager-cancel-button"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionComment("");
                        setActionError("");
                      }}
                      disabled={processing}
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

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
                <strong>
                  {document.reviewedByName || t("common.notAvailable")}
                </strong>
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
                <strong>
                  {t("documentDetails.rejectionComment")}
                </strong>
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
              <p className="details-muted">
                {t("documentDetails.noVersions")}
              </p>
            ) : (
              <div className="details-list">
                {document.versions.map((version) => (
                  <div className="details-list-item" key={version.id}>
                    <div className="details-list-icon">
                      <FileText size={18} />
                    </div>

                    <div className="details-list-content">
                      <strong>
                        {t("documentDetails.version")}{" "}
                        {version.versionNumber}
                      </strong>

                      <span>{version.originalFileName}</span>

                      <small>
                        {version.uploadedByName} ·{" "}
                        {formatDate(version.uploadedAt)}
                      </small>
                    </div>

                    <div className="version-actions">
                      <button
                        className="version-action-button"
                        title={t("documentActions.preview")}
                        onClick={() =>
                          handlePreview(
                            version.id,
                            version.originalFileName
                          )
                        }
                        disabled={previewLoading === version.id}
                      >
                        {previewLoading === version.id ? (
                          <RefreshCw size={17} className="spin" />
                        ) : (
                          <Eye size={17} />
                        )}

                        <span>{t("documentActions.preview")}</span>
                      </button>

                      <button
                        className="version-action-button"
                        title={t("documentActions.download")}
                        onClick={() =>
                          handleDownload(
                            version.id,
                            version.originalFileName
                          )
                        }
                        disabled={downloadingVersion === version.id}
                      >
                        {downloadingVersion === version.id ? (
                          <RefreshCw size={17} className="spin" />
                        ) : (
                          <Download size={17} />
                        )}

                        <span>{t("documentActions.download")}</span>
                      </button>
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
              <p className="details-muted">
                {t("documentDetails.noHistory")}
              </p>
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

      {previewUrl && (
        <div className="document-preview-overlay">
          <div className="document-preview-modal">
            <div className="document-preview-header">
              <h2>{previewName}</h2>

              <button
                onClick={() => setPreviewUrl("")}
                aria-label={t("documentActions.closePreview")}
              >
                <X size={22} />
              </button>
            </div>

            <div className="document-preview-content">
              {/\.(jpg|jpeg|png|webp)$/i.test(previewName) ? (
                <img src={previewUrl} alt={previewName} />
              ) : (
                <iframe src={previewUrl} title={previewName} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDocumentDetailsPage;
