import { Reservation } from "@/types/api";

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: (
    reservationId: string,
    status: Reservation["status"]
  ) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ReservationList({
  reservations,
  onStatusChange,
  getStatusColor,
  getStatusText,
}: ReservationListProps) {
  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.reservation_id}
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{reservation.customer_name}</h3>
              <p className="text-sm text-gray-600">
                {reservation.customer_phone}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.pet_name} ({reservation.pet_type})
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                reservation.status
              )}`}
            >
              {getStatusText(reservation.status)}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm">
              {reservation.service_name} - {reservation.price.toLocaleString()}
              원
            </p>
            <p className="text-sm text-gray-600">
              {new Date(reservation.reservation_date).toLocaleDateString()}{" "}
              {reservation.start_time} - {reservation.end_time}
            </p>
          </div>
          {reservation.memo && (
            <p className="mt-2 text-sm text-gray-600">{reservation.memo}</p>
          )}
          <div className="mt-4 flex gap-2">
            {reservation.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    onStatusChange(reservation.reservation_id, "confirmed")
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  예약 확정
                </button>
                <button
                  onClick={() =>
                    onStatusChange(reservation.reservation_id, "cancelled")
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  예약 취소
                </button>
              </>
            )}
            {reservation.status === "confirmed" && (
              <button
                onClick={() =>
                  onStatusChange(reservation.reservation_id, "completed")
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                서비스 완료
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
