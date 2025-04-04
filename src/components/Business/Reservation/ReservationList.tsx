import { Reservation } from "@/types/business";
import { ReservationCard } from "./ReservationCard";
import ReservationFilters from "./ReservationFilters";

interface ReservationListProps {
  reservations: Reservation[];
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate: (
    reservationId: string,
    newStatus: Reservation["status"]
  ) => Promise<void>;
}

export function ReservationList({
  reservations,
  onSearchChange,
  onStatusChange,
  onStatusUpdate,
}: ReservationListProps) {
  return (
    <div className="space-y-6">
      <ReservationFilters
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
      />
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.reservation_id}
            reservation={reservation}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}
