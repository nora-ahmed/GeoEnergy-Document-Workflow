
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getNotifications,
  getNotificationById,
  type NotificationItem,
} from "../../api/notificationApi";
import { useAuth } from "../../contexts/useAuth";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const isManager = user?.role === "Manager";
  const documentBasePath = isManager
    ? "/manager/documents"
    : "/engineer/documents";

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load notifications list
  useEffect(() => {
    let isActive = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNotifications();

        if (isActive) {
          setNotifications(data);
        }
      } catch {
        if (isActive) {
          setError(t("notifications.loadError"));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isActive = false;
    };
  }, [t]);

  // Load notification details when an ID exists
  useEffect(() => {
    if (!id) return;

    let isActive = true;

    const loadNotificationDetails = async () => {
      try {
        setDetailsLoading(true);
        setError("");

        const data = await getNotificationById(Number(id));

        if (isActive) {
          setSelectedNotification(data);
        }
      } catch {
        if (isActive) {
          setError(t("notifications.detailsError"));
        }
      } finally {
        if (isActive) {
          setDetailsLoading(false);
        }
      }
    };

    loadNotificationDetails();

    return () => {
      isActive = false;
    };
  }, [id, t]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  const openNotification = (notificationId: number) => {
    navigate(
      `${isManager ? "/manager" : "/engineer"}/notifications/${notificationId}`
    );
  };

  const openDocument = (documentId: number) => {
    navigate(`${documentBasePath}/${documentId}`);
  };

  // Notification details page
  if (id) {
    return (
      <div className="notifications-page">
        <button
          className="notifications-back-button"
          onClick={() =>
            navigate(
              isManager
                ? "/manager/notifications"
                : "/engineer/notifications"
            )
          }
        >
          <ArrowLeft size={18} />
          {t("notifications.back")}
        </button>

        {error ? (
          <div className="notifications-error">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : detailsLoading || !selectedNotification ? (
          <p className="notifications-message">
            {t("notifications.loading")}
          </p>
        ) : (
          <div className="notification-details-card">
            <div className="notification-details-icon">
              <Bell size={24} />
            </div>

            <h2>{selectedNotification.title}</h2>

            <div className="notification-date">
              <Clock size={15} />
              <span>{formatDate(selectedNotification.createdAt)}</span>
            </div>

            <p className="notification-details-message">
              {selectedNotification.message}
            </p>

            <button
              className="notification-document-button"
              onClick={() =>
                openDocument(selectedNotification.documentId)
              }
            >
              <FileText size={18} />
              {t("notifications.viewDocument")}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Notifications list page
  if (loading) {
    return (
      <div className="notifications-page">
        <p className="notifications-message">
          {t("notifications.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>{t("notifications.title")}</h1>
          <p>{t("notifications.subtitle")}</p>
        </div>

        <div className="notifications-header-icon">
          <Bell size={23} />
        </div>
      </div>

      {error ? (
        <div className="notifications-error">
          <AlertCircle size={20} />
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={35} />
          <h3>{t("notifications.emptyTitle")}</h3>
          <p>{t("notifications.emptyMessage")}</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className="notification-item"
              onClick={() => openNotification(notification.id)}
            >
              <div className="notification-item-icon">
                <Bell size={20} />
              </div>

              <div className="notification-item-content">
                <strong>{notification.title}</strong>

                <p>{notification.message}</p>

                <span className="notification-item-date">
                  <Clock size={13} />
                  {formatDate(notification.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

