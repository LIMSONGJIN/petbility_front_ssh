export enum ServiceCategory {
  FUNERAL = "funeral", // 장례
  CREMATION = "cremation", // 화장
  GROOMING = "grooming", // 미용
  BATHING = "bathing", // 목욕
  CUSTOM_VEHICLES = "custom_vehicles", // 맞춤 차량
  OTHER_CARE = "other_care", // 기타 케어
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
  NO_SHOW = "NO_SHOW",
}

export enum ScheduleType {
  WEEKLY = "WEEKLY",
  EXCEPTION = "EXCEPTION",
}

export enum NotificationType {
  RESERVATION_CREATED = "RESERVATION_CREATED",
  RESERVATION_UPDATED = "RESERVATION_UPDATED",
  RESERVATION_CANCELED = "RESERVATION_CANCELED",
  RESERVATION_ACCEPTED = "RESERVATION_ACCEPTED",
  RESERVATION_REJECTED = "RESERVATION_REJECTED",
  RESERVATION_COMPLETED = "RESERVATION_COMPLETED",
  RESERVATION_REMINDER = "RESERVATION_REMINDER",
  REVIEW_REQUESTED = "REVIEW_REQUESTED",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SYSTEM = "SYSTEM",
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: "USER" | "BUSINESS" | "ADMIN";
  createdAt: string;
}

export interface Pet {
  pet_id: string;
  user_id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  photo?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  service_id: string;
  admin_id: string;
  name: string;
  description: string;
  price: number;
  category: ServiceCategory;
  created_at: string;
  updated_at: string;
}

export interface BusinessAvailableTime {
  id: string;
  business_id: string;
  service_id: string;
  type: ScheduleType;
  day_of_week?: string;
  date?: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  reservation_id: string;
  user_id: string;
  business_id: string;
  service_id: string;
  pet_id: string;
  reserved_at: string;
  status: ReservationStatus;
  notes?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
