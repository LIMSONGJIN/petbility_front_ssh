export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "BLOCKED";

export interface Reservation {
  reservation_id: string;
  service_id: string | null;
  service_name?: string;
  user_id: string;
  business_id: string;
  pet_id: string | null;
  start_time: string;
  end_time: string;
  is_available: boolean;
  status: ReservationStatus;
  price?: number;
  note?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_phone?: string;
  pet_name?: string;
  pet_type?: string;
}

export interface AvailableTime {
  date: string;
  times: {
    start_time: string;
    end_time: string;
  }[];
}

export interface ReservationStatusUpdate {
  status: ReservationStatus;
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BlockTimeRequest {
  business_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  repeat_weekly?: boolean;
  day_of_week?: DayOfWeek;
  note?: string;
}

export interface WeeklySchedule {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface ExceptionDate {
  date: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  reason: string;
}

export interface ManageAvailableTimePayload {
  weekly_schedule: WeeklySchedule[];
  exception_dates: ExceptionDate[];
}
