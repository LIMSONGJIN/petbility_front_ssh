import {
  User,
  Service,
  Reservation,
  PaginationParams,
  PaginatedResponse,
} from "@/types/api";

// Business 타입 정의
interface Business {
  business_id: string;
  user_id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  categories?: string[];
  opening_hours?: {
    days: boolean[];
    start: string;
    end: string;
    break_start?: string;
    break_end?: string;
  };
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 관리자용 API
export const adminApi = {
  // 모든 사용자 조회
  getUsers: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<User>> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/users?${new URLSearchParams(params as any)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "사용자 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 특정 사용자 조회
  getUser: async (userId: string): Promise<User> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "사용자 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 사용자 정보 수정
  updateUser: async (
    userId: string,
    updateData: Partial<User>
  ): Promise<User> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "사용자 정보 수정에 실패했습니다.");
    }

    return response.json();
  },

  // 사용자 삭제
  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "사용자 삭제에 실패했습니다.");
    }

    return { success: true };
  },

  // 모든 비즈니스 조회
  getBusinesses: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Business>> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/businesses?${new URLSearchParams(params as any)}`,
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

  // 특정 비즈니스 조회
  getBusiness: async (businessId: string): Promise<Business> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/businesses/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "비즈니스 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 비즈니스 정보 수정
  updateBusiness: async (
    businessId: string,
    updateData: Partial<Business>
  ): Promise<Business> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/businesses/${businessId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "비즈니스 정보 수정에 실패했습니다."
      );
    }

    return response.json();
  },

  // 비즈니스 승인/거부
  updateBusinessStatus: async (
    businessId: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<Business> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/businesses/${businessId}/status`,
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
      throw new Error(
        errorData.message || "비즈니스 상태 변경에 실패했습니다."
      );
    }

    return response.json();
  },

  // 모든 서비스 조회
  getServices: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Service>> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/services?${new URLSearchParams(params as any)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "서비스 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 특정 서비스 조회
  getService: async (serviceId: string): Promise<Service> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/services/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "서비스 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 서비스 승인/거부
  updateServiceStatus: async (
    serviceId: string,
    status: "ACTIVE" | "INACTIVE" | "PENDING"
  ): Promise<Service> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/services/${serviceId}/status`,
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
      throw new Error(errorData.message || "서비스 상태 변경에 실패했습니다.");
    }

    return response.json();
  },

  // 모든 예약 조회
  getReservations: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Reservation>> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/admin/reservations?${new URLSearchParams(params as any)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "예약 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 통계 데이터 가져오기
  getStats: async (): Promise<{
    userCount: number;
    businessCount: number;
    reservationCount: number;
    serviceCount: number;
    recentUsers: User[];
    recentBusinesses: Business[];
    recentReservations: Reservation[];
  }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "통계 데이터를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },
};
