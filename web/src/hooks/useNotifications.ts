import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationResponse,
} from "../requests/notificationRequests";

const NOTIFICATIONS_KEY = ["notifications"] as const;
const REFRESH_MS = 15_000;

export function useNotifications() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: getNotifications,
    refetchInterval: REFRESH_MS,
    refetchIntervalInBackground: true,
    staleTime: 10_000,
  });

  const setReadLocally = (predicate: (notification: NotificationResponse) => boolean) =>
    queryClient.setQueryData<NotificationResponse[]>(NOTIFICATIONS_KEY, (current) =>
      current?.map((notification) => (predicate(notification) ? { ...notification, isRead: true } : notification)),
    );

  const markOne = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: (id: string) => setReadLocally((notification) => notification.id === id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: () => setReadLocally(() => true),
    onSettled: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });

  const notifications = query.data ?? [];

  return {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
    isLoading: query.isLoading,
    markAsRead: (id: string) => markOne.mutate(id),
    markAllAsRead: () => markAll.mutate(),
  };
}
