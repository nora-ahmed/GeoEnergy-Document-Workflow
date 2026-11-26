
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowUpRight,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { getDashboard, type DashboardData } from "../../api/documentApi";
import { useAuth } from "../../contexts/useAuth";
import "./EngineerDashboard.css";

const EngineerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
const loadDashboard = useCallback(async () => {
  try {
    const data = await getDashboard();
    setDashboard(data);
    setError("");
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    setError(t("dashboard.loadError"));
  } finally {
    setLoading(false);
  }
}, [t]);

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
      console.error("Failed to load dashboard:", err);

      if (!cancelled) {
        setError(t("dashboard.loadError"));
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchDashboard();

  return () => {
    cancelled = true;
  };
}, [t]);


  const stats = [
    {
      label: t("dashboard.totalDocuments"),
      value: dashboard?.totalDocuments ?? 0,
      icon: FileText,
      color: "blue",
    },
    {
      label: t("dashboard.pendingApproval"),
      value: dashboard?.pendingApproval ?? 0,
      icon: Clock3,
      color: "orange",
    },
    {
      label: t("dashboard.approved"),
      value: dashboard?.approved ?? 0,
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: t("dashboard.rejected"),
      value: dashboard?.rejected ?? 0,
      icon: XCircle,
      color: "red",
    },
  ];

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));

  const getStatusClass = (status: string) => {
    if (status.toLowerCase() === "pending approval") return "pending";
    return status.toLowerCase();
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "pending approval") {
      return t("status.pending");
    }

    if (normalizedStatus === "approved") {
      return t("status.approved");
    }

    if (normalizedStatus === "rejected") {
      return t("status.rejected");
    }

    return status;
  };

  return (
    <div className="engineer-dashboard">
      <div className="page-heading">
        <div>
          <h1>
            {t("dashboard.welcomeBack", {
              name: user?.fullName || t("roles.engineer"),
            })}{" "}
            👋
          </h1>
          <p>{t("dashboard.engineerSubtitle")}</p>
        </div>

        <button
          className="primary-action"
          onClick={() => navigate("/engineer/upload")}
        >
          <Upload size={17} />
          {t("navigation.uploadDocument")}
        </button>
      </div>

      {error && (
        <div className="dashboard-error" role="alert">
          <span>{error}</span>
        <button
  onClick={() => {
    setLoading(true);
    setError("");
    loadDashboard();
  }}
>
            <RefreshCw size={15} />
            {t("common.tryAgain")}
          </button>
        </div>
      )}

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.label}>
              <div className="stat-card-top">
                <span className={`stat-icon ${stat.color}`}>
                  <Icon size={20} />
                </span>
              </div>

              <div className="stat-value">
                {loading ? "—" : stat.value}
              </div>

              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <section className="documents-section">
        <div className="section-heading">
          <div>
            <h2>{t("dashboard.recentDocuments")}</h2>
            <p>{t("dashboard.recentDocumentsDescription")}</p>
          </div>

          <button
            className="view-all-link"
            onClick={() => navigate("/engineer/documents")}
          >
            {t("common.viewAll")}
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="documents-table-wrapper">
          {loading ? (
            <div className="dashboard-message">
              {t("dashboard.loadingRecentDocuments")}
            </div>
          ) : dashboard?.recentDocuments.length ? (
            <table className="documents-table">
              <thead>
                <tr>
                  <th>{t("common.document")}</th>
                  <th>{t("common.department")}</th>
                  <th>{t("documents.uploadedAt")}</th>
                  <th>{t("common.status")}</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentDocuments.map((document) => (
                  <tr key={document.id}>
                    <td>
                      <div className="document-name">
                        <span className="document-icon">
                          <FileText size={19} />
                        </span>
                        {document.title}
                      </div>
                    </td>

                    <td>{document.department}</td>
                    <td>{formatDate(document.uploadedAt)}</td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          document.status
                        )}`}
                      >
                        {getStatusLabel(document.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-documents">
              <FileText size={30} />
              <h3>{t("dashboard.noDocuments")}</h3>
              <p>{t("dashboard.noDocumentsDescription")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="documents-section quick-access-section">
        <div className="section-heading">
          <div>
            <h2>{t("dashboard.quickAccess")}</h2>
            <p>{t("dashboard.quickAccessDescription")}</p>
          </div>
        </div>

        <div className="quick-access-content">
          <button
            className="primary-action"
            onClick={() => navigate("/engineer/documents")}
          >
            <FolderOpen size={17} />
            {t("dashboard.browseDocuments")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default EngineerDashboard;
