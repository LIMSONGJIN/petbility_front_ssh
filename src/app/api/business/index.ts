import {
  Service,
  Customer,
  Reservation as BusinessReservation,
  SalesData,
  SalesSummary,
  BusinessStats,
  PaginationParams,
  PaginatedResponse,
  TimeRange,
} from "@/types/business";
import { ReservationStatus, ServiceCategory, Reservation } from "@/types/api";
import {
  dummyServices,
  dummyCustomers,
  dummyReservations,
  dummySalesData,
  dummySalesSummary,
  dummyBusinessStats,
} from "@/data/dummy/business";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 토큰 가져오는 유틸리티 함수
const getAuthToken = async () => {
  const session = await getSession();
  if (!session?.user?.jwt) {
    throw new Error("인증 토큰이 없습니다.");
  }
  return session.user.jwt;
};

// API Reservation을 Business Reservation으로 변환하는 함수
const convertToBusinessReservation = (
  reservation: Reservation
): BusinessReservation => {
  return {
    reservation_id: reservation.reservation_id,
    user_id: reservation.user_id,
    business_id: reservation.business_id || "dummy-business-id",
    service_id: reservation.service_id,
    status: reservation.status,
    price: reservation.price,
    notes: reservation.notes,
    start_time: reservation.start_time,
    end_time: reservation.end_time,
    is_available: reservation.is_available,
    created_at: reservation.created_at,
    updated_at: reservation.updated_at,
    pet_id: reservation.pet_id,
  };
};

// 서비스 관련 API
export const serviceApi = {
  getServices: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Service>> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations/services`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok)
        throw new Error("서비스 목록을 불러오는데 실패했습니다.");

      const data = await response.json();
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return {
        data: dummyServices,
        total: dummyServices.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(dummyServices.length / (params?.limit || 10)),
      };
    }
  },

  getService: async (id: string): Promise<Service> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/services/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok)
        throw new Error("서비스 정보를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return dummyServices.find(
        (service) => service.service_id === id
      ) as Service;
    }
  },

  updateService: async (
    id: string,
    service: Partial<Service>
  ): Promise<Service> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error("서비스 정보 업데이트에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 업데이트 및 반환
      const index = dummyServices.findIndex((s) => s.service_id === id);
      if (index === -1) throw new Error("Service not found");
      dummyServices[index] = {
        ...dummyServices[index],
        ...service,
        updated_at: new Date().toISOString(),
      };
      return dummyServices[index];
    }
  },

  updateServiceStatus: async (
    id: string,
    status: Service["status"]
  ): Promise<Service> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations/services/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("서비스 상태 업데이트에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 업데이트 및 반환
      const index = dummyServices.findIndex((s) => s.service_id === id);
      if (index === -1) throw new Error("Service not found");
      dummyServices[index] = {
        ...dummyServices[index],
        status,
        updated_at: new Date().toISOString(),
      };
      return dummyServices[index];
    }
  },
};

// 사용자 관련 API
export const userApi = {
  getUsers: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Customer>> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/users?${new URLSearchParams(params as any)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok)
        throw new Error("사용자 목록을 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return {
        data: dummyCustomers,
        total: dummyCustomers.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(dummyCustomers.length / (params?.limit || 10)),
      };
    }
  },

  getUser: async (id: string): Promise<Customer> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok)
        throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return dummyCustomers.find(
        (customer) => customer.user_id === id
      ) as Customer;
    }
  },

  createUser: async (
    user: Omit<Customer, "user_id" | "created_at" | "updated_at">
  ): Promise<Customer> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("사용자 정보 생성에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터에 추가 및 반환
      const newUser: Customer = {
        ...user,
        user_id: `usr-${dummyCustomers.length + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyCustomers.push(newUser);
      return newUser;
    }
  },

  updateUser: async (
    id: string,
    user: Partial<Customer>
  ): Promise<Customer> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("사용자 정보 업데이트에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 업데이트 및 반환
      const index = dummyCustomers.findIndex((c) => c.user_id === id);
      if (index === -1) throw new Error("User not found");
      dummyCustomers[index] = {
        ...dummyCustomers[index],
        ...user,
        updated_at: new Date().toISOString(),
      };
      return dummyCustomers[index];
    }
  },
};

// 예약 관련 API
export const reservationApi = {
  getReservations: async (
    params?: PaginationParams & { user_id?: string }
  ): Promise<PaginatedResponse<BusinessReservation>> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations?${new URLSearchParams(
          params as any
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok) throw new Error("예약 목록을 불러오는데 실패했습니다.");
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
        data: filteredReservations.map(convertToBusinessReservation),
        total: filteredReservations.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(
          filteredReservations.length / (params?.limit || 10)
        ),
      };
    }
  },

  getReservation: async (id: string): Promise<BusinessReservation> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok) throw new Error("예약 정보를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      const reservation = dummyReservations.find(
        (reservation) => reservation.reservation_id === id
      );
      if (!reservation) throw new Error("예약을 찾을 수 없습니다.");
      return convertToBusinessReservation(reservation);
    }
  },

  createReservation: async (
    reservation: Omit<
      Reservation,
      "reservation_id" | "created_at" | "updated_at"
    >
  ): Promise<Reservation> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(reservation),
      });
      if (!response.ok) throw new Error("예약 생성에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터에 추가 및 반환
      const newReservation: Reservation = {
        ...reservation,
        reservation_id: `res-${dummyReservations.length + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyReservations.push(newReservation);
      return newReservation;
    }
  },

  updateReservation: async (
    id: string,
    reservation: Partial<Reservation>
  ): Promise<Reservation> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(reservation),
        }
      );
      if (!response.ok) throw new Error("예약 정보 업데이트에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 업데이트 및 반환
      const index = dummyReservations.findIndex((r) => r.reservation_id === id);
      if (index === -1) throw new Error("Reservation not found");
      dummyReservations[index] = {
        ...dummyReservations[index],
        ...reservation,
        updated_at: new Date().toISOString(),
      };
      return dummyReservations[index];
    }
  },

  updateReservationStatus: async (
    id: string,
    status: Reservation["status"]
  ): Promise<Reservation> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("예약 상태 업데이트에 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 업데이트 및 반환
      const index = dummyReservations.findIndex((r) => r.reservation_id === id);
      if (index === -1) throw new Error("Reservation not found");
      dummyReservations[index] = {
        ...dummyReservations[index],
        status,
        updated_at: new Date().toISOString(),
      };
      return dummyReservations[index];
    }
  },
};

// 매출 관련 API
export const salesApi = {
  getSalesData: async (timeRange: TimeRange): Promise<SalesData[]> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/sales/data?${new URLSearchParams(
          timeRange as any
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok)
        throw new Error("매출 데이터를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return dummySalesData;
    }
  },

  getSalesSummary: async (timeRange: TimeRange): Promise<SalesSummary> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/business/sales/summary?${new URLSearchParams(
          timeRange as any
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok)
        throw new Error("매출 요약 정보를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return dummySalesSummary;
    }
  },
};

// 통계 관련 API
export const statsApi = {
  getBusinessStats: async (): Promise<BusinessStats> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/business/stats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok)
        throw new Error("비즈니스 통계 정보를 불러오는데 실패했습니다.");
      return response.json();
    } catch (error) {
      console.warn("API 연동 실패, 더미데이터 반환:", error);
      // 실패 시 더미데이터 반환
      return dummyBusinessStats;
    }
  },
};

// 비즈니스 API
export const businessApi = {
  // 비즈니스 정보 조회
  getBusinessInfo: async (businessId: string) => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
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
  updateBusinessInfo: async (businessId: string, updateData: any) => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
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

  // 비즈니스 서비스 목록 조회
  getBusinessServices: async (businessId: string) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/services`,
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

  // 비즈니스 서비스 추가
  addBusinessService: async (businessId: string, serviceData: any) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "서비스 추가에 실패했습니다.");
    }

    return response.json();
  },

  // 비즈니스 서비스 수정
  updateBusinessService: async (
    businessId: string,
    serviceId: string,
    updateData: any
  ) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/services/${serviceId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "서비스 수정에 실패했습니다.");
    }

    return response.json();
  },

  // 비즈니스 서비스 삭제
  deleteBusinessService: async (businessId: string, serviceId: string) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/services/${serviceId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "서비스 삭제에 실패했습니다.");
    }

    return { success: true };
  },

  // 비즈니스 예약 목록 조회
  getBusinessReservations: async (businessId: string) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/reservations`,
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

  // 비즈니스 예약 상태 업데이트
  updateReservationStatus: async (
    businessId: string,
    reservationId: string,
    status: string
  ) => {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/reservations/${reservationId}`,
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
        errorData.message || "예약 상태 업데이트에 실패했습니다."
      );
    }

    return response.json();
  },
};
