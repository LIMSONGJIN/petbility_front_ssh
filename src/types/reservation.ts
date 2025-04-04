export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export interface Reservation {
  reservation_id: string;
  service_id: string;
  service_name: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  pet_name: string;
  pet_type: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  price: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableTime {
  date: string;
  times: string[];
}

export interface ReservationStatusUpdate {
  status: ReservationStatus;
}
