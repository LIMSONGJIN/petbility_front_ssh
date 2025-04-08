export enum ServiceCategory {
  FUNERAL = "funeral", // 장례
  CREMATION = "cremation", // 화장
  GROOMING = "grooming", // 미용
  BATHING = "bathing", // 목욕
  CUSTOM_VEHICLES = "custom_vehicles", // 맞춤 차량
  OTHER_CARE = "other_care", // 기타 케어
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

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

export enum UserRole {
  USER = "USER",
  BUSINESS = "BUSINESS",
  ADMIN = "ADMIN",
}

export enum PetGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  address?: string;
  profile_image?: string;
  role: "USER" | "BUSINESS";
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  pet_id: string;
  owner_id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: "MALE" | "FEMALE";
  neutered?: boolean;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  service_id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "active" | "inactive";
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableTime {
  date: string;
  times: string[];
}

export interface Reservation {
  reservation_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  pet_id: string;
  pet_name: string;
  pet_type: string;
  service_id: string;
  service_name: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  price: number;
  memo?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  customer_id: string;
  pet_id: string;
  service_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  memo?: string;
}

export interface UpdateReservationData {
  status?: ReservationStatus;
  memo?: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  created_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
