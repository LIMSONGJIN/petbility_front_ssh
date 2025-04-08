import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/lib/useSocket";
import { Notification } from "@/types/api";
import { notificationApi } from "@/api";

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 알림 데이터 로드
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);

      const unreadCountData = await notificationApi.getUnreadCount();
      setUnreadCount(unreadCountData.count);
    } catch (error) {
      console.error("알림을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 웹소켓에서 새 알림 수신
  const handleNewNotification = useCallback((data: Notification) => {
    setNotifications((prev) => [data, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  // 웹소켓 연결
  const socket = useSocket(
    // 사용자 ID는 로그인 상태에서 가져오거나 localStorage에서 가져올 수 있습니다
    localStorage.getItem("userId") || "",
    handleNewNotification
  );

  // 알림 읽음 처리
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const updatedNotification = await notificationApi.markAsRead(
        notificationId
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? updatedNotification
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error("알림 읽음 처리에 실패했습니다:", error);
      return false;
    }
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error("모든 알림 읽음 처리에 실패했습니다:", error);
      return false;
    }
  }, []);

  // 알림 삭제
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.deleteNotification(notificationId);
        const deletedNotification = notifications.find(
          (n) => n.notification_id === notificationId
        );
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.notification_id !== notificationId
          )
        );

        // 읽지 않은 알림을 삭제한 경우 카운트 감소
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        return true;
      } catch (error) {
        console.error("알림 삭제에 실패했습니다:", error);
        return false;
      }
    },
    [notifications]
  );

  // 모든 알림 삭제
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error("모든 알림 삭제에 실패했습니다:", error);
      return false;
    }
  }, []);

  // 컴포넌트 마운트 시 알림 로드
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications: loadNotifications,
  };
}
