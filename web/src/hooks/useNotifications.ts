import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    type NotificationResponse,
} from "../requests/notificationRequests";

const NOTIFICATIONS_KEY = ["notifications"] as const;
const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;

export function useNotifications() {
    const queryClient = useQueryClient();

    const {
        data: notifications = [],
        isLoading,
        error,
    } = useQuery<NotificationResponse[]>({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: getNotifications,
        staleTime: 60_000,
        refetchOnWindowFocus: true,
    });

    const { data: unreadCount = 0 } = useQuery<number>({
        queryKey: UNREAD_COUNT_KEY,
        queryFn: getUnreadCount,
        staleTime: 30_000,
        refetchInterval: 30_000,
    });

    const { mutate: markAsRead } = useMutation({
        mutationFn: (notificationId: string) =>
            markNotificationAsRead(notificationId),
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
            await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

            const previousNotifications =
                queryClient.getQueryData<NotificationResponse[]>(
                    NOTIFICATIONS_KEY,
                );
            const previousCount =
                queryClient.getQueryData<number>(UNREAD_COUNT_KEY);

            queryClient.setQueryData<NotificationResponse[]>(
                NOTIFICATIONS_KEY,
                (old) =>
                    old?.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n,
                    ),
            );
            queryClient.setQueryData<number>(UNREAD_COUNT_KEY, (old) =>
                Math.max(0, (old ?? 0) - 1),
            );

            return { previousNotifications, previousCount };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(
                    NOTIFICATIONS_KEY,
                    context.previousNotifications,
                );
            }
            if (context?.previousCount !== undefined) {
                queryClient.setQueryData(
                    UNREAD_COUNT_KEY,
                    context.previousCount,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
        },
    });

    const { mutate: markAllAsRead } = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
            await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

            const previousNotifications =
                queryClient.getQueryData<NotificationResponse[]>(
                    NOTIFICATIONS_KEY,
                );
            const previousCount =
                queryClient.getQueryData<number>(UNREAD_COUNT_KEY);

            queryClient.setQueryData<NotificationResponse[]>(
                NOTIFICATIONS_KEY,
                (old) => old?.map((n) => ({ ...n, isRead: true })),
            );
            queryClient.setQueryData<number>(UNREAD_COUNT_KEY, 0);

            return { previousNotifications, previousCount };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(
                    NOTIFICATIONS_KEY,
                    context.previousNotifications,
                );
            }
            if (context?.previousCount !== undefined) {
                queryClient.setQueryData(
                    UNREAD_COUNT_KEY,
                    context.previousCount,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
        },
    });

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
    };
}
