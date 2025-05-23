import {
  Reservation,
  AvailableTime,
  ReservationStatus,
  CreateReservationData,
} from "@/types/api";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface UpdateReservationData {
  start_time?: string;
  end_time?: string;
  notes?: string;
  status?: ReservationStatus;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  profile_image: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  review_count: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceWithBusiness {
  service_id: string;
  service_name: string;
  price: string;
  business: Business;
}

export interface DayAvailability {
  date: string;
  day_of_week: number;
  is_day_off: boolean;
  is_fully_blocked: boolean;
  has_reservations: boolean;
  blocked_count: number;
  reserved_count: number;
  available_times?: string[]; // 일별 조회 시 시간대 포함
}

export interface MonthlySchedule {
  year: number;
  month: number;
  days_in_month: number;
  availability_by_date: {
    [date: string]: DayAvailability;
  };
  weekly_schedule: {
    [day_of_week: string]: {
      break_time: {
        end: string;
        start: string;
        reason: string;
      } | null;
      is_day_off: boolean;
      working_hours: {
        end: string;
        start: string;
      } | null;
    };
  };
}

export interface DailySchedule {
  detailed_date: string;
  date: string;
  is_day_off: boolean;
  available_time_slots: string[];
  weekly_schedule: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
  break_time: {
    start_time: string;
    end_time: string;
    reason: string;
  } | null;
}

export interface Pet {
  pet_id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePetData {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  photo: string;
}

// 토큰 가져오는 유틸리티 함수
const getAuthToken = async () => {
  const session = await getSession();
  if (!session?.user?.jwt) {
    throw new Error("인증 토큰이 없습니다.");
  }
  return session.user.jwt;
};

// 사용자 예약 관련 API
export const userReservationApi = {
  // 예약 생성
  createReservation: async (
    reservationData: CreateReservationData
  ): Promise<Reservation> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...reservationData,
        status: ReservationStatus.PENDING,
        is_available: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "예약 생성에 실패했습니다.");
    }

    return response.json();
  },

  // 사용자의 예약 목록 조회
  getMyReservations: async (): Promise<Reservation[]> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/reservations/my-reservations`, {
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
    const token = await getAuthToken();

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
    const token = await getAuthToken();

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
    const token = await getAuthToken();

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

  // 서비스 목록 조회
  getAllServices: async (): Promise<any[]> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/reservations/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "서비스 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 서비스 ID별 사업자 목록 조회
  getBusinessesByServiceId: async (
    serviceId: string
  ): Promise<ServiceWithBusiness[]> => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/reservations/services/${serviceId}/businesses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "서비스 제공 사업자 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 예약 가능 시간 조회 (날짜별)
  getAvailableTimes: async (
    businessId: string,
    serviceId: string,
    date: string
  ): Promise<string[]> => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/reservations/businesses/${businessId}/services/${serviceId}/available-times/${date}`,
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
  getDisabledDates: async (
    businessId: string,
    serviceId?: string
  ): Promise<string[]> => {
    const token = await getAuthToken();

    let url = `${API_URL}/reservations/businesses/${businessId}/disabled-dates`;
    if (serviceId) url += `?service_id=${serviceId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 불가능 날짜를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 예약 가능 스케줄 조회 (월별)
  getMonthlySchedule: async (
    businessId: string,
    serviceId: string,
    yearMonth: string
  ): Promise<MonthlySchedule> => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/reservations/businesses/${businessId}/services/${serviceId}/schedules/${yearMonth}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 가능 스케줄을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 예약 가능 스케줄 조회 (일별)
  getDailySchedule: async (
    businessId: string,
    serviceId: string,
    date: string
  ): Promise<DailySchedule> => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/reservations/businesses/${businessId}/services/${serviceId}/schedules/${date}`,
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

// 사용자 API 추가
export const userApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<any[]> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "사용자 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 사용자의 반려동물 목록 조회
  getMyPets: async (): Promise<Pet[]> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "반려동물 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 반려동물 등록
  createPet: async (petData: CreatePetData): Promise<Pet> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "반려동물 등록에 실패했습니다.");
    }

    return response.json();
  },

  // 반려동물 삭제
  deletePet: async (petId: string): Promise<void> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "반려동물 삭제에 실패했습니다.");
    }
  },
};
