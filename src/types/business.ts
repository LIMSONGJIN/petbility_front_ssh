import { ReservationStatus, ServiceCategory } from "./api";

// 공통 타입
export interface TimeRange {
  start: string;
  end: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  service_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 서비스 관련 타입
export interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number;
  category: ServiceCategory;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  rating?: number;
  bookings?: number;
}

// 고객 관련 타입
export interface Customer {
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  memo?: string;
  created_at: string;
  updated_at: string;
}

// 예약 관련 타입
export interface Reservation {
  reservation_id: string;
  user_id: string;
  business_id: string;
  service_id?: string;
  pet_id?: string;
  status: ReservationStatus;
  notes?: string;
  price: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// 매출 관련 타입
export interface SalesData {
  date: string;
  total_amount: number;
  service_sales: {
    service_name: string;
    amount: number;
  }[];
  payment_methods: {
    method: "card" | "cash";
    amount: number;
  }[];
}

export interface SalesSummary {
  total_sales: number;
  average_sales: number;
  service_sales: {
    service_name: string;
    amount: number;
  }[];
  payment_methods: {
    method: "card" | "cash";
    amount: number;
  }[];
}

// 통계 관련 타입
export interface BusinessStats {
  total_customers: number;
  total_reservations: number;
  total_services: number;
  total_sales: number;
  recent_reservations: Reservation[];
}
