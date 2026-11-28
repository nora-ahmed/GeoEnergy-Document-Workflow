
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  Upload,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  UserCircle,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../contexts/useAuth";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isManager = user?.role === "Manager";

  const navigation = isManager
    ? [
        { label: t("navigation.overview"), path: "/manager", icon: LayoutDashboard },
        { label: t("navigation.allDocuments"), path: "/manager/documents", icon: FileText },
        { label: t("navigation.pendingReviews"), path: "/manager/pending", icon: ClipboardCheck },
     { label: t("navigation.notifications"), path: "/manager/notifications", icon: Bell },
      ]
    : [
        { label: t("navigation.overview"), path: "/engineer", icon: LayoutDashboard },
        { label: t("navigation.myDocuments"), path: "/engineer/documents", icon: FileText },
        { label: t("navigation.uploadDocument"), path: "/engineer/upload", icon: Upload },
    { label: t("navigation.notifications"), path: "/engineer/notifications", icon: Bell },
      ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <FileText size={23} />
          </div>

          <div>
            <h2>{t("app.name")}</h2>
            <span>{t("app.subtitle")}</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("navigation.closeNavigation")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">
          {t("navigation.workspace")}
        </div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/manager" || item.path === "/engineer"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                <ChevronRight size={15} className="sidebar-link-arrow" />
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.fullName}</strong>
              <span>
                {isManager ? t("roles.manager") : t("roles.engineer")}
              </span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>{t("auth.logout")}</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("navigation.openNavigation")}
          >
            <Menu size={22} />
          </button>

          <div className="topbar-breadcrumb">
            <span>{t("navigation.workspace")}</span>
            <ChevronRight size={15} />
            <strong>
              {isManager
                ? t("navigation.managerPortal")
                : t("navigation.engineerPortal")}
            </strong>
          </div>

          <div className="topbar-actions">
            <LanguageSwitcher />

            <div className="topbar-user">
              <div className="topbar-user-info">
                <strong>{user?.fullName}</strong>
                <span>{user?.department}</span>
              </div>
              <UserCircle size={34} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
