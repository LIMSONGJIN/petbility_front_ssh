import { Reservation } from "@/types/business";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ReservationCardProps {
  reservation: Reservation;
  onStatusUpdate: (
    reservationId: string,
    newStatus: Reservation["status"]
  ) => Promise<void>;
}

export function ReservationCard({
  reservation,
  onStatusUpdate,
}: ReservationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "결제 대기";
      case "confirmed":
        return "예약 확정";
      case "completed":
        return "서비스 완료";
      case "cancelled":
        return "예약 취소";
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: Reservation["status"]) => {
    await onStatusUpdate(reservation.reservation_id, newStatus);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{reservation.service_name}</h3>
              <span className={`text-sm ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(reservation.reservation_date)}{" "}
              {reservation.start_time} ~ {reservation.end_time}
            </p>
            <div className="text-sm">
              <p>고객: {reservation.customer_name}</p>
              <p>연락처: {reservation.customer_phone}</p>
              <p>
                반려동물: {reservation.pet_name} ({reservation.pet_type})
              </p>
            </div>
            {reservation.note && (
              <p className="text-sm text-gray-600">메모: {reservation.note}</p>
            )}
          </div>
          <div className="flex gap-2">
            {reservation.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("confirmed")}
              >
                예약 확정
              </Button>
            )}
            {reservation.status === "confirmed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("completed")}
              >
                서비스 완료
              </Button>
            )}
            {(reservation.status === "pending" ||
              reservation.status === "confirmed") && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={() => handleStatusChange("cancelled")}
              >
                예약 취소
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
