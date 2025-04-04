import {
  Service,
  Customer,
  Reservation,
  SalesData,
  SalesSummary,
  BusinessStats,
  PaginationParams,
  PaginatedResponse,
  TimeRange,
} from "@/types/business";
import {
  dummyServices,
  dummyCustomers,
  dummyReservations,
  dummySalesData,
  dummySalesSummary,
  dummyBusinessStats,
} from "@/data/dummy/business";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// 서비스 관련 API
export const serviceApi = {
  getServices: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Service>> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/services?${new URLSearchParams(params as any)}`
    // );
    // return response.json();
    return {
      data: dummyServices,
      total: dummyServices.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: Math.ceil(dummyServices.length / (params?.limit || 10)),
    };
  },

  getService: async (id: string): Promise<Service> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/services/${id}`);
    // return response.json();
    return dummyServices.find(
      (service) => service.service_id === id
    ) as Service;
  },

  updateService: async (
    id: string,
    service: Partial<Service>
  ): Promise<Service> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/services/${id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(service),
    // });
    // return response.json();
    const index = dummyServices.findIndex((s) => s.service_id === id);
    if (index === -1) throw new Error("Service not found");
    dummyServices[index] = {
      ...dummyServices[index],
      ...service,
      updated_at: new Date().toISOString(),
    };
    return dummyServices[index];
  },

  updateServiceStatus: async (
    id: string,
    status: Service["status"]
  ): Promise<Service> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/services/${id}/status`,
    //   {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ status }),
    //   }
    // );
    // return response.json();
    const index = dummyServices.findIndex((s) => s.service_id === id);
    if (index === -1) throw new Error("Service not found");
    dummyServices[index] = {
      ...dummyServices[index],
      status,
      updated_at: new Date().toISOString(),
    };
    return dummyServices[index];
  },
};

// 고객 관련 API
export const customerApi = {
  getCustomers: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Customer>> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/customers?${new URLSearchParams(params as any)}`
    // );
    // return response.json();
    return {
      data: dummyCustomers,
      total: dummyCustomers.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: Math.ceil(dummyCustomers.length / (params?.limit || 10)),
    };
  },

  getCustomer: async (id: string): Promise<Customer> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/customers/${id}`);
    // return response.json();
    return dummyCustomers.find(
      (customer) => customer.user_id === id
    ) as Customer;
  },

  createCustomer: async (
    customer: Omit<Customer, "user_id" | "created_at" | "updated_at">
  ): Promise<Customer> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/customers`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(customer),
    // });
    // return response.json();
    const newCustomer: Customer = {
      ...customer,
      user_id: `usr-${dummyCustomers.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyCustomers.push(newCustomer);
    return newCustomer;
  },

  updateCustomer: async (
    id: string,
    customer: Partial<Customer>
  ): Promise<Customer> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/customers/${id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(customer),
    // });
    // return response.json();
    const index = dummyCustomers.findIndex((c) => c.user_id === id);
    if (index === -1) throw new Error("Customer not found");
    dummyCustomers[index] = {
      ...dummyCustomers[index],
      ...customer,
      updated_at: new Date().toISOString(),
    };
    return dummyCustomers[index];
  },
};

// 예약 관련 API
export const reservationApi = {
  getReservations: async (
    params?: PaginationParams & { customer_id?: string }
  ): Promise<PaginatedResponse<Reservation>> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/reservations?${new URLSearchParams(
    //     params as any
    //   )}`
    // );
    // return response.json();
    let filteredReservations = dummyReservations;
    if (params?.customer_id) {
      filteredReservations = dummyReservations.filter(
        (r) => r.customer_id === params.customer_id
      );
    }
    return {
      data: filteredReservations,
      total: filteredReservations.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: Math.ceil(
        filteredReservations.length / (params?.limit || 10)
      ),
    };
  },

  getReservation: async (id: string): Promise<Reservation> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/reservations/${id}`);
    // return response.json();
    return dummyReservations.find(
      (reservation) => reservation.reservation_id === id
    ) as Reservation;
  },

  createReservation: async (
    reservation: Omit<
      Reservation,
      "reservation_id" | "created_at" | "updated_at"
    >
  ): Promise<Reservation> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/reservations`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(reservation),
    // });
    // return response.json();
    const newReservation: Reservation = {
      ...reservation,
      reservation_id: `res-${dummyReservations.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyReservations.push(newReservation);
    return newReservation;
  },

  updateReservation: async (
    id: string,
    reservation: Partial<Reservation>
  ): Promise<Reservation> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/reservations/${id}`,
    //   {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(reservation),
    //   }
    // );
    // return response.json();
    const index = dummyReservations.findIndex((r) => r.reservation_id === id);
    if (index === -1) throw new Error("Reservation not found");
    dummyReservations[index] = {
      ...dummyReservations[index],
      ...reservation,
      updated_at: new Date().toISOString(),
    };
    return dummyReservations[index];
  },

  updateReservationStatus: async (
    id: string,
    status: Reservation["status"]
  ): Promise<Reservation> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/reservations/${id}/status`,
    //   {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ status }),
    //   }
    // );
    // return response.json();
    const index = dummyReservations.findIndex((r) => r.reservation_id === id);
    if (index === -1) throw new Error("Reservation not found");
    dummyReservations[index] = {
      ...dummyReservations[index],
      status,
      updated_at: new Date().toISOString(),
    };
    return dummyReservations[index];
  },
};

// 매출 관련 API
export const salesApi = {
  getSalesData: async (timeRange: TimeRange): Promise<SalesData[]> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/sales/data?${new URLSearchParams(
    //     timeRange as any
    //   )}`
    // );
    // return response.json();
    return dummySalesData;
  },

  getSalesSummary: async (timeRange: TimeRange): Promise<SalesSummary> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(
    //   `${API_BASE_URL}/business/sales/summary?${new URLSearchParams(
    //     timeRange as any
    //   )}`
    // );
    // return response.json();
    return dummySalesSummary;
  },
};

// 통계 관련 API
export const statsApi = {
  getBusinessStats: async (): Promise<BusinessStats> => {
    // TODO: 실제 API 연동 시 주석 해제
    // const response = await fetch(`${API_BASE_URL}/business/stats`);
    // return response.json();
    return dummyBusinessStats;
  },
};
