import { Service, ReservationStatus } from "./api";

export interface ReservationPayload {
  service_id: string;
  business_id: string;
  pet_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  memo?: string;
}

export interface BlockTimePayload {
  reservation_date: string;
  start_time: string;
  end_time: string;
  service_id?: string;
  memo?: string;
}

export interface ManageAvailableTimePayload {
  weeklySchedule: WeeklySchedule[];
  exceptionDates: ExceptionDate[];
  schedule: {
    startTime: string;
    endTime: string;
    breakTime: {
      start: string;
      end: string;
    };
    selectedDays: boolean[];
  };
}

export interface WeeklySchedule {
  day_of_week: string; // 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  start_time: string; // 'HH:MM' 형식 (예: '09:00')
  end_time: string; // 'HH:MM' 형식 (예: '18:00')
  is_day_off?: boolean; // 휴무일 여부
}

export interface ExceptionDate {
  day_of_week: string; // 'MONDAY' 또는 '2025-04-10'
  start_time: string; // ISO 형식: '2025-04-10T12:00:00Z'
  end_time: string; // ISO 형식
  reason?: string;
}

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// 비즈니스 스케줄 관리 페이로드
export interface ManageBusinessSchedulePayload {
  schedule: {
    selectedDays: boolean[]; // 길이 7, [일, 월, 화, 수, 목, 금, 토]
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    breakTime?: {
      start: string; // HH:mm
      end: string; // HH:mm
    };
  };
}

// 비즈니스 스케줄 정보
export interface BusinessSchedule {
  weeklySchedule: WeeklySchedule[];
  exceptionDates: ExceptionDate[];
}

// 특정 날짜의 예약 가능 시간대
export interface AvailableTimeSlots {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

// 예약 생성 결과
export interface ReservationResult {
  reservation_id: string;
  status: ReservationStatus;
  message: string;
}
