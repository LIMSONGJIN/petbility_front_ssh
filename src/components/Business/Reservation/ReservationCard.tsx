import { Reservation, ReservationStatus } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// 확장된 예약 정보 타입 정의
interface ReservationWithDetails extends Reservation {
  service_name?: string;
  customer_name?: string;
  customer_phone?: string;
  pet_name?: string;
  pet_type?: string;
  memo?: string;
}

interface ReservationCardProps {
  reservation: ReservationWithDetails;
  onStatusUpdate: (
    reservationId: string,
    newStatus: ReservationStatus
  ) => Promise<void>;
}

export function ReservationCard({
  reservation,
  onStatusUpdate,
}: ReservationCardProps) {
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return "text-yellow-600";
      case ReservationStatus.CONFIRMED:
        return "text-blue-600";
      case ReservationStatus.COMPLETED:
        return "text-green-600";
      case ReservationStatus.CANCELED:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return "결제 대기";
      case ReservationStatus.CONFIRMED:
        return "예약 확정";
      case ReservationStatus.COMPLETED:
        return "서비스 완료";
      case ReservationStatus.CANCELED:
        return "예약 취소";
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: ReservationStatus) => {
    await onStatusUpdate(reservation.reservation_id, newStatus);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {reservation.service_name || "서비스 정보 없음"}
              </h3>
              <span className={`text-sm ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(reservation.start_time)}{" "}
              {format(new Date(reservation.start_time), "HH:mm")} ~{" "}
              {format(new Date(reservation.end_time), "HH:mm")}
            </p>
            <div className="text-sm">
              <p>고객: {reservation.customer_name || "고객 정보 없음"}</p>
              <p>연락처: {reservation.customer_phone || "연락처 정보 없음"}</p>
              <p>
                반려동물: {reservation.pet_name || "반려동물 정보 없음"} (
                {reservation.pet_type || "종류 정보 없음"})
              </p>
            </div>
            {reservation.memo && (
              <p className="text-sm text-gray-600">메모: {reservation.memo}</p>
            )}
            {reservation.notes && !reservation.memo && (
              <p className="text-sm text-gray-600">메모: {reservation.notes}</p>
            )}
          </div>
          <div className="flex gap-2">
            {reservation.status === ReservationStatus.PENDING && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(ReservationStatus.CONFIRMED)}
              >
                예약 확정
              </Button>
            )}
            {reservation.status === ReservationStatus.CONFIRMED && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(ReservationStatus.COMPLETED)}
              >
                서비스 완료
              </Button>
            )}
            {(reservation.status === ReservationStatus.PENDING ||
              reservation.status === ReservationStatus.CONFIRMED) && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={() => handleStatusChange(ReservationStatus.CANCELED)}
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
