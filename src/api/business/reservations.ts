import {
  Reservation,
  AvailableTime,
  ReservationStatusUpdate,
} from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchReservations = async (): Promise<Reservation[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await fetch(`${API_URL}/business/reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("예약 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
};

export const fetchReservationById = async (
  reservationId: string
): Promise<Reservation> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await fetch(
    `${API_URL}/business/reservations/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("예약 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
};

export const updateReservationStatus = async (
  reservationId: string,
  status: string
): Promise<Reservation> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await fetch(
    `${API_URL}/business/reservations/${reservationId}/status`,
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
    throw new Error("예약 상태를 업데이트하는데 실패했습니다.");
  }

  return response.json();
};

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

  const response = await fetch(`${API_URL}/business/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("영업 시간 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
};

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
};

export async function fetchAvailableTimes(
  serviceId: string
): Promise<AvailableTime[]> {
  const response = await fetch(
    `${API_URL}/business/reservations/available-time/${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("예약 가능 시간을 불러오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchAvailableTimesByDate(
  serviceId: string,
  date: string
): Promise<AvailableTime> {
  const response = await fetch(
    `${API_URL}/business/reservations/available-time/${serviceId}/date`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("해당 날짜의 예약 가능 시간을 불러오는데 실패했습니다.");
  }

  return response.json();
}

export async function createAvailableTime(
  serviceId: string,
  availableTime: AvailableTime
): Promise<AvailableTime> {
  const response = await fetch(
    `${API_URL}/business/reservations/available-time/${serviceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(availableTime),
    }
  );

  if (!response.ok) {
    throw new Error("예약 가능 시간 생성에 실패했습니다.");
  }

  return response.json();
}
