import {
  Reservation,
  CreateReservationData,
  UpdateReservationData,
} from "@/types/api";
import { api } from "./api";

export const reservationApi = {
  createReservation: async (
    data: CreateReservationData
  ): Promise<Reservation> => {
    const response = await api.post<Reservation>("/reservations", data);
    return response.data;
  },

  getMyReservations: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>("/reservations/my");
    return response.data;
  },

  getReservation: async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  updateReservation: async (
    id: string,
    data: UpdateReservationData
  ): Promise<Reservation> => {
    const response = await api.patch<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  cancelReservation: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },

  getBusinessesByService: async (serviceId: string): Promise<any[]> => {
    const response = await api.get(`/reservations/businesses/${serviceId}`);
    return response.data;
  },

  getAvailableTimes: async (
    businessId: string,
    serviceId: string,
    date: string
  ): Promise<string[]> => {
    const response = await api.get(
      `/reservations/available-times/${businessId}/${serviceId}`,
      {
        params: { date },
      }
    );
    return response.data;
  },

  getAvailableTimesByService: async (
    serviceId: string,
    date: string
  ): Promise<{ business_id: string; times: string[] }[]> => {
    const response = await api.get(
      `/reservations/available-times/${serviceId}`,
      {
        params: { date },
      }
    );
    return response.data;
  },

  getDisabledDates: async (serviceId: string): Promise<string[]> => {
    const response = await api.get(`/reservations/disabled-dates/${serviceId}`);
    return response.data;
  },
};
