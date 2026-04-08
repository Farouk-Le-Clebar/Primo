import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

const apiUrl = window?._env_?.API_URL;

export interface NotificationResponse {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata: Record<string, any> | null;
    isRead: boolean;
    createdAt: string;
}

export function getNotifications(): Promise<NotificationResponse[]> {
    return axios
        .get(`${apiUrl}/notifications`, { headers: getAuthHeaders() })
        .then((res) => res.data);
}

export function getUnreadCount(): Promise<number> {
    return axios
        .get(`${apiUrl}/notifications/unread-count`, {
            headers: getAuthHeaders(),
        })
        .then((res) => res.data.count);
}

export function markNotificationAsRead(
    notificationId: string,
): Promise<NotificationResponse> {
    return axios
        .patch(
            `${apiUrl}/notifications/${notificationId}/read`,
            {},
            { headers: getAuthHeaders() },
        )
        .then((res) => res.data);
}

export function markAllNotificationsAsRead(): Promise<void> {
    return axios
        .patch(
            `${apiUrl}/notifications/read-all`,
            {},
            { headers: getAuthHeaders() },
        )
        .then(() => undefined);
}

export function deleteNotification(notificationId: string): Promise<void> {
    return axios
        .delete(`${apiUrl}/notifications/${notificationId}`, {
            headers: getAuthHeaders(),
        })
        .then(() => undefined);
}
