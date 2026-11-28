
import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { getDashboard, getManagerDashboardCharts } from "../../api/documentApi";
import type {
  DashboardData,
  DocumentItem,
  ManagerDashboardCharts,
} from "../../api/documentApi";
import "./ManagerDashboard.css";

const STATUS_COLORS: Record<string, string> = {
  "Pending Approval": "#f59e0b",
  Approved: "#22c55e",
  Rejected: "#ef4444",
};

const ManagerDashboard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const locale = isArabic ? "ar-EG" : "en-GB";

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [charts, setCharts] = useState<ManagerDashboardCharts | null>(null);

  const [error, setError] = useState("");
  const [chartsError, setChartsError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(true);

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

    const fetchCharts = async () => {
      try {
        const data = await getManagerDashboardCharts();

        if (!cancelled) {
          setCharts(data);
          setChartsError("");
        }
      } catch (err) {
        console.error("Failed to load manager dashboard charts:", err);

        if (!cancelled) {
          setChartsError(t("managerDashboard.chartsError"));
        }
      } finally {
        if (!cancelled) {
          setChartsLoading(false);
        }
      }
    };

    fetchDashboard();
    fetchCharts();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const loadDashboard = useCallback(async () => {
    setRefreshing(true);
    setError("");
    setChartsError("");
    setChartsLoading(true);

    const [dashboardResult, chartsResult] = await Promise.allSettled([
      getDashboard(),
      getManagerDashboardCharts(),
    ]);

    if (dashboardResult.status === "fulfilled") {
      setDashboard(dashboardResult.value);
    } else {
      console.error("Failed to refresh manager dashboard:", dashboardResult.reason);
      setError(t("managerDashboard.loadError"));
    }

    if (chartsResult.status === "fulfilled") {
      setCharts(chartsResult.value);
    } else {
      console.error("Failed to refresh dashboard charts:", chartsResult.reason);
      setChartsError(t("managerDashboard.chartsError"));
    }

    setChartsLoading(false);
    setRefreshing(false);
  }, [t]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  const formatNumber = (value: number) =>
    value.toLocaleString(locale);

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

  const statusChartData = charts?.statusCounts.map((item) => ({
    name: getStatusLabel(item.status),
    count: item.count,
    color: STATUS_COLORS[item.status] || "#94a3b8",
  })) ?? [];

  const departmentChartData = charts?.departmentCounts.map((item) => ({
    department: item.department,
    count: item.count,
  })) ?? [];

  const totalStatusDocuments = statusChartData.reduce(
    (total, item) => total + item.count,
    0
  );

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
        <span className={`manager-status ${getStatusClass(doc.status)}`}>
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
          <RefreshCw size={17} className={refreshing ? "spin" : ""} />
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
                <div className="manager-stat-card" key={stat.className}>
                  <div className={`manager-stat-icon ${stat.className}`}>
                    <Icon size={22} />
                  </div>

                  <div className="manager-stat-content">
                    <span>{stat.label}</span>
                    <strong>{formatNumber(stat.value)}</strong>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Manager Dashboard Charts */}
          <section className="manager-charts-section">
            <div className="manager-section-header">
              <div>
                <h2>{t("managerDashboard.analytics")}</h2>
                <p>{t("managerDashboard.analyticsDescription")}</p>
              </div>
            </div>

            {chartsError && (
              <div className="manager-dashboard-error">
                <p>{chartsError}</p>
                <button onClick={loadDashboard}>
                  {t("common.tryAgain")}
                </button>
              </div>
            )}

            {chartsLoading ? (
              <div className="manager-dashboard-loading">
                <RefreshCw size={25} className="spin" />
                <p>{t("common.loading")}</p>
              </div>
            ) : !chartsError && charts ? (
              <div className="manager-charts-grid">
                {/* Status Donut Chart */}
                <div className="manager-chart-card">
                  <div className="manager-chart-header">
                    <h3>{t("managerDashboard.statusDistribution")}</h3>
                    <p>{t("managerDashboard.statusDescription")}</p>
                  </div>

                  {totalStatusDocuments === 0 ? (
                    <div className="manager-chart-empty">
                      {t("managerDashboard.noChartData")}
                    </div>
                  ) : (
                    <>
                      <div className="manager-donut-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={statusChartData}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={95}
                              paddingAngle={3}
                            >
                              {statusChartData.map((entry, index) => (
                                <Cell
                                  key={`status-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>

                            <Tooltip
                              formatter={(value) => [
                                formatNumber(Number(value)),
                                t("managerDashboard.documentsCount"),
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="manager-donut-center">
                          <strong>{formatNumber(totalStatusDocuments)}</strong>
                          <span>{t("managerDashboard.totalDocuments")}</span>
                        </div>
                      </div>

                      <div className="manager-chart-legend">
                        {statusChartData.map((item) => (
                          <div
                            className="manager-legend-item"
                            key={item.name}
                          >
                            <span
                              className="manager-legend-dot"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                            <strong>{formatNumber(item.count)}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Department Bar Chart */}
                <div className="manager-chart-card">
                  <div className="manager-chart-header">
                    <h3>{t("managerDashboard.departmentDistribution")}</h3>
                    <p>{t("managerDashboard.departmentDescription")}</p>
                  </div>

                  {departmentChartData.length === 0 ? (
                    <div className="manager-chart-empty">
                      {t("managerDashboard.noChartData")}
                    </div>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(250, departmentChartData.length * 55)}
                    >
                      <BarChart
                        data={departmentChartData}
                        layout="vertical"
                        margin={{
                          top: 10,
                          right: isArabic ? 15 : 20,
                          left: isArabic ? 20 : 15,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                        />

                        <YAxis
                          type="category"
                          dataKey="department"
                          width={110}
                          orientation={isArabic ? "right" : "left"}
                          tick={{ fontSize: 12 }}
                        />

                        <Tooltip
                          formatter={(value) => [
                            formatNumber(Number(value)),
                            t("managerDashboard.documentsCount"),
                          ]}
                        />

                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[0, 6, 6, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          {/* Recent Documents */}
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
