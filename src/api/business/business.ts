import {
  Reservation,
  ReservationStatus,
  PaginationParams,
  PaginatedResponse,
  AvailableTime,
} from "@/types/api";
import { dummyReservations } from "@/data/dummy/business";
import { ManageAvailableTimePayload } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AvailableTimeData {
  type: "WEEKLY" | "EXCEPTION";
  day_of_week?: number;
  date?: string;
  start_time: string;
  end_time: string;
  available: boolean;
  reason?: string;
}

// 비즈니스 예약 관련 API
export const businessReservationApi = {
  // 모든 예약 조회
  getReservations: async (
    params?: PaginationParams & { user_id?: string }
  ): Promise<PaginatedResponse<Reservation>> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
      const response = await fetch(
        `${API_URL}/business/reservations?${new URLSearchParams(
          params as any
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("예약 목록을 불러오는데 실패했습니다.");
      }

      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      let filteredReservations = dummyReservations;
      if (params?.user_id) {
        filteredReservations = dummyReservations.filter(
          (r) => r.customer_id === params.user_id
        );
      }
      return {
        data: filteredReservations as unknown as Reservation[],
        total: filteredReservations.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(
          filteredReservations.length / (params?.limit || 10)
        ),
      };
    }
  },

  // 특정 예약 조회
  getReservation: async (id: string): Promise<Reservation> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
      const response = await fetch(`${API_URL}/business/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("예약 정보를 불러오는데 실패했습니다.");
      }

      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      const reservation = dummyReservations.find(
        (r) => r.reservation_id === id
      );
      if (!reservation) throw new Error("예약을 찾을 수 없습니다.");
      return reservation as unknown as Reservation;
    }
  },

  // 예약 상태 변경
  updateReservationStatus: async (
    id: string,
    status: ReservationStatus
  ): Promise<Reservation> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/business/reservations/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 상태 변경에 실패했습니다.");
    }

    return response.json();
  },

  // 예약 가능 시간 관리
  manageAvailableTime: async (
    businessId: string,
    payload: ManageAvailableTimePayload
  ): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const endpoint = `${API_URL}/business/reservations/${businessId}/available-time`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 가능 시간 관리에 실패했습니다."
      );
    }

    return await response.json();
  },

  // 특정 서비스의 예약 가능 시간 조회
  getAvailableTimes: async (serviceId: string): Promise<AvailableTime[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/business/reservations/available-time/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 가능 시간을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 특정 날짜의 예약 가능 시간 조회
  getAvailableTimesByDate: async (
    serviceId: string,
    date: string
  ): Promise<AvailableTime[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/business/reservations/available-time/${serviceId}/date?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 가능 시간을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },
};
