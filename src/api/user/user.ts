import { Reservation, AvailableTime } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CreateReservationData {
  service_id: string;
  business_id: string;
  pet_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  note?: string;
}

interface UpdateReservationData {
  reservation_date?: string;
  start_time?: string;
  end_time?: string;
  note?: string;
}

// 사용자 예약 관련 API
export const userReservationApi = {
  // 예약 생성
  createReservation: async (
    reservationData: CreateReservationData
  ): Promise<Reservation> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 생성에 실패했습니다.");
    }

    return response.json();
  },

  // 사용자의 예약 목록 조회
  getMyReservations: async (): Promise<Reservation[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 특정 예약 조회
  getReservation: async (reservationId: string): Promise<Reservation> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 예약 수정
  updateReservation: async (
    reservationId: string,
    updateData: UpdateReservationData
  ): Promise<Reservation> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 수정에 실패했습니다.");
    }

    return response.json();
  },

  // 예약 취소
  cancelReservation: async (
    reservationId: string
  ): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 취소에 실패했습니다.");
    }

    return { success: true };
  },

  // 서비스별 비즈니스 조회
  getBusinessesByService: async (serviceId: string): Promise<any[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/reservations/available-time/businesses?service_id=${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "비즈니스 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 예약 가능 시간 조회
  getAvailableTimes: async (
    businessId: string,
    serviceId: string,
    date: string
  ): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/reservations/available-time/available-times?business_id=${businessId}&service_id=${serviceId}&date=${date}`,
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

  // 서비스별 예약 가능 시간 조회
  getAvailableTimesByService: async (
    serviceId: string,
    businessId: string,
    date: string
  ): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/reservations/available-times/${serviceId}?business_id=${businessId}&date=${date}`,
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

  // 예약 불가능 날짜 조회
  getDisabledDates: async (serviceId: string): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/reservations/disabled-dates/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 불가능 날짜를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },
};
