import {
  Reservation,
  AvailableTime,
  ReservationStatus,
  ScheduleType,
} from "@/types/api";
import { businessReservationApi } from "./business";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// business.ts에서 가져온 함수들
export const fetchReservations = businessReservationApi.getReservations;
export const fetchReservationById = businessReservationApi.getReservation;
export const updateReservationStatus =
  businessReservationApi.updateReservationStatus;

/**
 * 비즈니스 스케줄 정보를 조회합니다.
 */
export const fetchBusinessSchedule = async (): Promise<{
  startTime: string;
  endTime: string;
  breakTime: {
    start: string;
    end: string;
  };
  selectedDays: boolean[];
}> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  try {
    const response = await fetch(`${API_URL}/business/schedule`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("영업 시간 정보를 불러오는데 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.warn("API 연동 실패:", error);
    throw error;
  }
};

/**
 * 비즈니스 스케줄을 업데이트합니다.
 */
export const updateBusinessSchedule = async (schedule: {
  startTime: string;
  endTime: string;
  breakTime: {
    start: string;
    end: string;
  };
  selectedDays: boolean[];
}): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  try {
    const response = await fetch(`${API_URL}/business/schedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      throw new Error("영업 시간을 업데이트하는데 실패했습니다.");
    }
  } catch (error) {
    console.warn("API 연동 실패:", error);
    throw error;
  }
};

/**
 * 특정 서비스의 예약 가능 시간을 조회합니다.
 */
export async function fetchAvailableTimes(
  serviceId: string
): Promise<AvailableTime[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  try {
    const response = await fetch(
      `${API_URL}/business/reservations/available-time/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("예약 가능 시간을 불러오는데 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.warn("API 연동 실패:", error);
    throw error;
  }
}

/**
 * 특정 날짜의 예약 가능 시간을 조회합니다.
 */
export async function fetchAvailableTimesByDate(
  serviceId: string,
  date: string
): Promise<AvailableTime[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  try {
    const response = await fetch(
      `${API_URL}/business/reservations/available-time/${serviceId}/date?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("예약 가능 시간을 불러오는데 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.warn("API 연동 실패:", error);
    throw error;
  }
}

/**
 * 예약 가능 시간을 관리합니다.
 */
export async function manageAvailableTime(
  serviceId: string,
  availableTimeData: {
    type: ScheduleType;
    day_of_week?: number;
    date?: string;
    start_time: string;
    end_time: string;
    available: boolean;
    reason?: string;
  }
): Promise<AvailableTime> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  try {
    const response = await fetch(
      `${API_URL}/business/reservations/available-time/${serviceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(availableTimeData),
      }
    );

    if (!response.ok) {
      throw new Error("예약 가능 시간 관리에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.warn("API 연동 실패:", error);
    throw error;
  }
}
