import {
  Reservation,
  ReservationStatus,
  PaginationParams,
  PaginatedResponse,
  AvailableTime,
} from "@/types/api";
import { dummyReservations, dummyCustomers } from "@/data/dummy/business";
import {
  BlockTimePayload,
  ManageBusinessSchedulePayload,
  AvailableTimeSlots,
  BusinessSchedule,
} from "@/types/reservation";
import { Customer } from "@/types/business";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 비즈니스 서비스 관련 API 응답 타입
export interface BusinessServiceResponse {
  id: string;
  business_id: string;
  service_id: string;
  is_active: boolean;
}

// 비즈니스 서비스 관련 API
export const businessServiceApi = {
  // 서비스 활성화/비활성화
  updateServiceStatus: async (
    serviceId: string,
    status: "active" | "inactive"
  ): Promise<BusinessServiceResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    console.log("API 호출 → PATCH", {
      serviceId,
      status,
      token,
    });

    try {
      const response = await fetch(
        `${API_URL}/business/reservations/my-services/${serviceId}/status`,
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
        if (response.status === 404) {
          throw new Error("서비스를 찾을 수 없습니다.");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "서비스 상태 변경에 실패했습니다."
        );
      }

      return response.json();
    } catch (error) {
      console.warn("서비스 상태 변경 API 연동 실패, 가상 응답 반환:", error);

      // 로컬 스토리지에 서비스 상태 저장 (API 실패 시에도 상태 기억)
      const storageKey = `service_status_${serviceId}`;
      localStorage.setItem(storageKey, status);

      // API 실패 시 더미 응답 생성
      return {
        id: `dummy-${serviceId}`,
        business_id: "current-business",
        service_id: serviceId,
        is_active: status === "active",
      };
    }
  },

  // 서비스 상태 조회 (로컬 스토리지 기반)
  getServiceStatus: (serviceId: string): "active" | "inactive" => {
    const storageKey = `service_status_${serviceId}`;
    return (
      (localStorage.getItem(storageKey) as "active" | "inactive") || "inactive"
    );
  },
};

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
          (r) => r.user_id === params.user_id
        );
      }
      return {
        data: filteredReservations as Reservation[],
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
      return reservation as Reservation;
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
};

// 비즈니스 스케줄 관련 API
export const businessScheduleApi = {
  // 비즈니스 영업 일정 관리
  manageBusinessSchedule: async (
    businessId: string,
    payload: ManageBusinessSchedulePayload
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/business/schedule/${businessId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "영업 일정 설정에 실패했습니다.");
    }
  },

  // 비즈니스 영업 일정 조회
  getBusinessSchedule: async (
    businessId: string
  ): Promise<ManageBusinessSchedulePayload> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/business/schedule/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("영업 일정을 불러오는데 실패했습니다.");
    }

    return response.json();
  },

  // 특정 날짜의 예약 가능 시간 조회
  getAvailableTimeSlots: async (
    businessId: string,
    date: string
  ): Promise<AvailableTimeSlots> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/business/schedule/${businessId}/date?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("예약 가능 시간을 불러오는데 실패했습니다.");
    }

    return response.json();
  },
};

// 비즈니스 API
export const businessApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<Customer[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
      const response = await fetch(`${API_URL}/business/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("사용자 목록을 불러오는데 실패했습니다.");
      }

      return response.json();
    } catch (error) {
      console.warn("사용자 API 연동 실패, 더미데이터 반환:", error);
      // API 실패 시 더미 데이터 반환
      return dummyCustomers;
    }
  },

  // 특정 사용자 조회
  getUser: async (userId: string): Promise<Customer> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
      const response = await fetch(`${API_URL}/business/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      }

      return response.json();
    } catch (error) {
      console.warn("사용자 상세 API 연동 실패, 더미데이터 반환:", error);
      // API 실패 시 더미 데이터에서 해당 사용자 찾아 반환
      const user = dummyCustomers.find((u: Customer) => u.user_id === userId);
      if (!user) throw new Error("사용자를 찾을 수 없습니다.");
      return user;
    }
  },

  // 사용자 정보 업데이트
  updateUser: async (
    userId: string,
    userData: Partial<Customer>
  ): Promise<Customer> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
      const response = await fetch(`${API_URL}/business/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("사용자 정보 업데이트에 실패했습니다.");
      }

      return response.json();
    } catch (error) {
      console.warn("사용자 업데이트 API 연동 실패:", error);
      // 실패 시에도 업데이트 성공으로 가정하고 업데이트된 데이터 반환
      const user = dummyCustomers.find((u: Customer) => u.user_id === userId);
      if (!user) throw new Error("사용자를 찾을 수 없습니다.");

      // 업데이트된 사용자 정보 반환 (실제로는 백엔드에 저장되지 않음)
      return {
        ...user,
        ...userData,
        updated_at: new Date().toISOString(),
      } as Customer;
    }
  },
};
