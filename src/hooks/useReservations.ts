import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useReservations() {
  const reservations = useSelector(
    (state: RootState) => state.reservations.reservations
  );
  return { reservations };
}
