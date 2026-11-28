
import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDashboard } from "../../api/documentApi";
import type {
  DashboardData,
  DocumentItem,
} from "../../api/documentApi";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
const [error, setError] = useState("");
const [refreshing, setRefreshing] = useState(false);

const loading = dashboard === null && error === "";

useEffect(() => {
  let cancelled = false;

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();

      if (!cancelled) {
        setDashboard(data);
        setError("");
      }
    } catch (err) {
      console.error("Failed to load manager dashboard:", err);

      if (!cancelled) {
        setError(t("managerDashboard.loadError"));
      }
    }
  };

  fetchDashboard();

  return () => {
    cancelled = true;
  };
}, [t]);

const loadDashboard = useCallback(async () => {
  setRefreshing(true);
  setError("");

  try {
    const data = await getDashboard();
    setDashboard(data);
  } catch (err) {
    console.error("Failed to refresh manager dashboard:", err);
    setError(t("managerDashboard.loadError"));
  } finally {
    setRefreshing(false);
  }
}, [t]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return t("status.approved");
      case "rejected":
        return t("status.rejected");
      case "pending approval":
        return t("status.pending");
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
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

  const statistics = dashboard
    ? [
        {
          label: t("managerDashboard.totalDocuments"),
          value: dashboard.totalDocuments,
          icon: FileText,
          className: "total",
        },
        {
          label: t("managerDashboard.pendingApproval"),
          value: dashboard.pendingApproval,
          icon: Clock,
          className: "pending",
        },
        {
          label: t("managerDashboard.approved"),
          value: dashboard.approved,
          icon: CheckCircle,
          className: "approved",
        },
        {
          label: t("managerDashboard.rejected"),
          value: dashboard.rejected,
          icon: XCircle,
          className: "rejected",
        },
      ]
    : [];

  const renderRecentDocument = (doc: DocumentItem) => (
    <tr key={doc.id}>
      <td>
        <div className="manager-document-title">
          <FileText size={17} />
          <div>
            <strong>{doc.title}</strong>
            <small dir="ltr">DOC-{doc.id}</small>
          </div>
        </div>
      </td>
      <td>{doc.uploadedByName}</td>
      <td>{doc.department}</td>
      <td>{formatDate(doc.uploadedAt)}</td>
      <td>
        <span
          className={`manager-status ${getStatusClass(doc.status)}`}
        >
          {getStatusLabel(doc.status)}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="manager-dashboard">
      <header className="manager-dashboard-header">
        <div>
          <span className="manager-eyebrow">
            {t("managerDashboard.eyebrow")}
          </span>
          <h1>{t("managerDashboard.title")}</h1>
          <p>{t("managerDashboard.subtitle")}</p>
        </div>

        <button
          className="manager-refresh-button"
          onClick={loadDashboard}
disabled={refreshing}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          {t("managerDashboard.refresh")}
        </button>
      </header>

      {error && (
        <div className="manager-dashboard-error">
          <p>{error}</p>
          <button onClick={loadDashboard}>
            {t("common.tryAgain")}
          </button>
        </div>
      )}

      {loading ? (
        <div className="manager-dashboard-loading">
          <RefreshCw size={25} className="spin" />
          <p>{t("common.loading")}</p>
        </div>
      ) : dashboard ? (
        <>
          <section className="manager-statistics">
            {statistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="manager-stat-card"
                  key={stat.className}
                >
                  <div className={`manager-stat-icon ${stat.className}`}>
                    <Icon size={22} />
                  </div>

                  <div className="manager-stat-content">
                    <span>{stat.label}</span>
                    <strong>{stat.value.toLocaleString(
                      isArabic ? "ar-EG" : "en-GB"
                    )}</strong>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="manager-recent-section">
            <div className="manager-section-header">
              <div>
                <h2>{t("managerDashboard.recentDocuments")}</h2>
                <p>{t("managerDashboard.recentDescription")}</p>
              </div>
            </div>

            {dashboard.recentDocuments.length === 0 ? (
              <div className="manager-empty-state">
                <FileText size={35} />
                <p>{t("managerDashboard.noDocuments")}</p>
              </div>
            ) : (
              <div className="manager-table-wrapper">
                <table className="manager-documents-table">
                  <thead>
                    <tr>
                      <th>{t("common.document")}</th>
                      <th>{t("managerDashboard.uploadedBy")}</th>
                      <th>{t("common.department")}</th>
                      <th>{t("managerDashboard.uploadedAt")}</th>
                      <th>{t("common.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentDocuments.map(renderRecentDocument)}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
};

export default ManagerDashboard;
