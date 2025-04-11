import {
  Service,
  Customer,
  SalesData,
  SalesSummary,
  BusinessStats,
  Reservation as BusinessReservation,
} from "@/types/business";
import { ReservationStatus, ServiceCategory, Reservation } from "@/types/api";

// 서비스 더미 데이터
export const dummyServices: Service[] = [
  {
    service_id: "svc-001",
    name: "장례 서비스",
    description: "전문 장례 서비스 제공",
    price: 1000000,
    category: ServiceCategory.FUNERAL,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    service_id: "svc-002",
    name: "화장 서비스",
    description: "전문 화장 서비스 제공",
    price: 500000,
    category: ServiceCategory.FUNERAL,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    service_id: "svc-003",
    name: "미용 서비스",
    description: "장례 전 미용 서비스",
    price: 100000,
    category: ServiceCategory.GROOMING,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    service_id: "svc-004",
    name: "목욕 서비스",
    description: "장례 전 목욕 서비스",
    price: 80000,
    category: ServiceCategory.GROOMING,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    service_id: "svc-005",
    name: "기타 케어",
    description: "기타 장례 관련 케어 서비스",
    price: 50000,
    category: ServiceCategory.OTHER_CARE,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// 고객 더미 데이터
export const dummyCustomers: Customer[] = [
  {
    user_id: "usr-001",
    name: "김철수",
    phone: "010-1234-5678",
    email: "chulsoo@example.com",
    address: "서울시 강남구",
    memo: "VIP 고객",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "usr-002",
    name: "이영희",
    phone: "010-8765-4321",
    email: "younghee@example.com",
    address: "서울시 서초구",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// 예약 더미 데이터
export const dummyReservations: Reservation[] = [
  {
    reservation_id: "res-001",
    user_id: "usr-001",
    business_id: "bus-001",
    service_id: "svc-001",
    pet_id: "pet-001",
    status: ReservationStatus.CONFIRMED,
    notes: "특별한 장례식 요청",
    start_time: "2024-04-01T14:00:00Z",
    end_time: "2024-04-01T16:00:00Z",
    is_available: true,
    price: 1000000,
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
  {
    reservation_id: "res-002",
    user_id: "usr-002",
    business_id: "bus-001",
    service_id: "svc-002",
    pet_id: "pet-002",
    status: ReservationStatus.PENDING,
    notes: "화장 후 유골함 요청",
    start_time: "2024-04-02T10:00:00Z",
    end_time: "2024-04-02T12:00:00Z",
    is_available: true,
    price: 500000,
    created_at: "2024-03-21T00:00:00Z",
    updated_at: "2024-03-21T00:00:00Z",
  },
  {
    reservation_id: "res-003",
    user_id: "usr-001",
    business_id: "bus-001",
    service_id: "svc-003",
    pet_id: "pet-003",
    status: ReservationStatus.COMPLETED,
    notes: "특별한 스타일링 요청",
    start_time: "2024-04-03T09:00:00Z",
    end_time: "2024-04-03T11:00:00Z",
    is_available: true,
    price: 100000,
    created_at: "2024-03-22T00:00:00Z",
    updated_at: "2024-03-22T00:00:00Z",
  },
  {
    reservation_id: "res-004",
    user_id: "usr-002",
    business_id: "bus-001",
    service_id: "svc-004",
    pet_id: "pet-004",
    status: ReservationStatus.CANCELED,
    notes: "고객 요청으로 취소",
    start_time: "2024-04-04T15:00:00Z",
    end_time: "2024-04-04T16:00:00Z",
    is_available: true,
    price: 80000,
    created_at: "2024-03-23T00:00:00Z",
    updated_at: "2024-03-23T00:00:00Z",
  },
  {
    reservation_id: "res-005",
    user_id: "usr-001",
    business_id: "bus-001",
    service_id: "svc-005",
    pet_id: "pet-005",
    status: ReservationStatus.CONFIRMED,
    notes: "특별 케어 요청",
    start_time: "2024-04-05T11:00:00Z",
    end_time: "2024-04-05T12:00:00Z",
    is_available: true,
    price: 50000,
    created_at: "2024-03-24T00:00:00Z",
    updated_at: "2024-03-24T00:00:00Z",
  },
  {
    reservation_id: "res-006",
    user_id: "bus-001",
    business_id: "bus-001",
    service_id: undefined,
    pet_id: undefined,
    status: ReservationStatus.BLOCKED,
    notes: "점심 시간",
    start_time: "2024-04-06T12:00:00Z",
    end_time: "2024-04-06T13:00:00Z",
    is_available: false,
    price: 0,
    created_at: "2024-03-25T00:00:00Z",
    updated_at: "2024-03-25T00:00:00Z",
  },
];

// 비즈니스 통계용 예약 데이터
export const dummyBusinessReservations: BusinessReservation[] =
  dummyReservations.slice(0, 5).map((reservation) => ({
    reservation_id: reservation.reservation_id,
    user_id: reservation.user_id,
    business_id: reservation.business_id,
    service_id: reservation.service_id,
    pet_id: reservation.pet_id,
    status: reservation.status,
    price: reservation.price,
    start_time: reservation.start_time,
    end_time: reservation.end_time,
    is_available: reservation.is_available,
    notes: reservation.notes,
    created_at: reservation.created_at,
    updated_at: reservation.updated_at,
  }));

// 매출 더미 데이터
export const dummySalesData: SalesData[] = [
  {
    date: "2024-04-01",
    total_amount: 1000000,
    service_sales: [{ service_name: "장례 서비스", amount: 1000000 }],
    payment_methods: [{ method: "card", amount: 1000000 }],
  },
  {
    date: "2024-04-02",
    total_amount: 500000,
    service_sales: [{ service_name: "화장 서비스", amount: 500000 }],
    payment_methods: [{ method: "cash", amount: 500000 }],
  },
  {
    date: "2024-04-03",
    total_amount: 100000,
    service_sales: [{ service_name: "미용 서비스", amount: 100000 }],
    payment_methods: [{ method: "card", amount: 100000 }],
  },
  {
    date: "2024-04-04",
    total_amount: 80000,
    service_sales: [{ service_name: "목욕 서비스", amount: 80000 }],
    payment_methods: [{ method: "card", amount: 80000 }],
  },
  {
    date: "2024-04-05",
    total_amount: 50000,
    service_sales: [{ service_name: "기타 케어", amount: 50000 }],
    payment_methods: [{ method: "card", amount: 50000 }],
  },
];

// 매출 요약 더미 데이터
export const dummySalesSummary: SalesSummary = {
  total_sales: 1730000,
  average_sales: 346000,
  service_sales: [
    { service_name: "장례 서비스", amount: 1000000 },
    { service_name: "화장 서비스", amount: 500000 },
    { service_name: "미용 서비스", amount: 100000 },
    { service_name: "목욕 서비스", amount: 80000 },
    { service_name: "기타 케어", amount: 50000 },
  ],
  payment_methods: [
    { method: "card", amount: 1230000 },
    { method: "cash", amount: 500000 },
  ],
};

// 비즈니스 통계 더미 데이터
export const dummyBusinessStats: BusinessStats = {
  total_customers: 2,
  total_reservations: 5,
  total_services: 5,
  total_sales: 1730000,
  recent_reservations: dummyBusinessReservations,
};
