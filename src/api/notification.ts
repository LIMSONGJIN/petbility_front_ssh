import { Notification } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const notificationApi = {
  // 모든 알림 조회
  getNotifications: async (): Promise<Notification[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "알림 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "알림 읽음 처리에 실패했습니다.");
    }

    return response.json();
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "모든 알림 읽음 처리에 실패했습니다."
      );
    }

    return { success: true };
  },

  // 특정 알림 삭제
  deleteNotification: async (
    notificationId: string
  ): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "알림 삭제에 실패했습니다.");
    }

    return { success: true };
  },

  // 모든 알림 삭제
  deleteAllNotifications: async (): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/notifications`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "모든 알림 삭제에 실패했습니다.");
    }

    return { success: true };
  },

  // 읽지 않은 알림 개수 조회
  getUnreadCount: async (): Promise<{ count: number }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "읽지 않은 알림 개수를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },
};
