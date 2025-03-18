import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
  id: string;
  userId: string;
  providerId: string;
  service: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface ReservationsState {
  reservations: Reservation[];
}

const initialState: ReservationsState = {
  reservations: [],
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    updateReservationStatus: (
      state,
      action: PayloadAction<{ id: string; status: Reservation["status"] }>
    ) => {
      const reservation = state.reservations.find(
        (r) => r.id === action.payload.id
      );
      if (reservation) {
        reservation.status = action.payload.status;
      }
    },
  },
});

export const { setReservations, addReservation, updateReservationStatus } =
  reservationsSlice.actions;
export default reservationsSlice.reducer;
