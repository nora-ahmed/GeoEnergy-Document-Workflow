import api from "./axios";

export interface NotificationItem {
  id: number;
  documentId: number;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await api.get<NotificationItem[]>("/Notifications");
  return response.data;
};

export const getNotificationById = async (
  id: number
): Promise<NotificationItem> => {
  const response = await api.get<NotificationItem>(`/Notifications/${id}`);
  return response.data;
};