import { create } from "zustand";

interface ReservationData {
  serviceId: string;
  businessId: string;
  amount: string;
  notes: string;
  paymentKey?: string;
  orderId?: string;
}

interface ReservationStore {
  reservationData: ReservationData | null;
  setReservationData: (data: ReservationData) => void;
  clearReservationData: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservationData: null,
  setReservationData: (data) => set({ reservationData: data }),
  clearReservationData: () => set({ reservationData: null }),
}));
