import { Reservation, ReservationStatus } from "@/types/api";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: (reservationId: string, status: ReservationStatus) => void;
  getStatusColor: (status: ReservationStatus) => string;
  getStatusText: (status: ReservationStatus) => string;
}

// 예약 항목에 필요한 추가 정보
interface ReservationWithDetails extends Reservation {
  userName?: string;
  userPhone?: string;
  petName?: string;
  petType?: string;
  serviceName?: string;
}

export function ReservationList({
  reservations,
  onStatusChange,
  getStatusColor,
  getStatusText,
}: ReservationListProps) {
  const [reservationsWithDetails, setReservationsWithDetails] = useState<
    ReservationWithDetails[]
  >([]);

  useEffect(() => {
    // 실제 환경에서는 여기서 userApi와 petApi를 이용해 사용자와 반려동물 정보를 조회해야 함
    // 임시로 더미 데이터 추가
    const enrichedReservations = reservations.map((reservation) => ({
      ...reservation,
      userName: "사용자 이름", // 실제로는 API에서 조회한 이름 사용
      userPhone: "010-1234-5678", // 실제로는 API에서 조회한 전화번호 사용
      petName: "반려동물 이름", // 실제로는 API에서 조회한 반려동물 이름 사용
      petType: "강아지/고양이", // 실제로는 API에서 조회한 반려동물 종류 사용
      serviceName: "서비스 이름", // 실제로는 API에서 조회한 서비스 이름 사용
    }));

    setReservationsWithDetails(enrichedReservations);
  }, [reservations]);

  return (
    <div className="space-y-4">
      {reservationsWithDetails.map((reservation) => (
        <div
          key={reservation.reservation_id}
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {reservation.userName || "고객 정보 없음"}
              </h3>
              <p className="text-sm text-gray-600">
                {reservation.userPhone || "전화번호 정보 없음"}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.petName || "반려동물 정보 없음"} (
                {reservation.petType || "종류 정보 없음"})
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
              {reservation.serviceName || "서비스 정보 없음"} -{" "}
              {reservation.price.toLocaleString()}원
            </p>
            <p className="text-sm text-gray-600">
              {format(new Date(reservation.start_time), "yyyy-MM-dd")}{" "}
              {format(new Date(reservation.start_time), "HH:mm")} -{" "}
              {format(new Date(reservation.end_time), "HH:mm")}
            </p>
          </div>
          {reservation.notes && (
            <p className="mt-2 text-sm text-gray-600">{reservation.notes}</p>
          )}
          <div className="mt-4 flex gap-2">
            {reservation.status === ReservationStatus.PENDING && (
              <>
                <button
                  onClick={() =>
                    onStatusChange(
                      reservation.reservation_id,
                      ReservationStatus.CONFIRMED
                    )
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  예약 확정
                </button>
                <button
                  onClick={() =>
                    onStatusChange(
                      reservation.reservation_id,
                      ReservationStatus.CANCELED
                    )
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  예약 취소
                </button>
              </>
            )}
            {reservation.status === ReservationStatus.CONFIRMED && (
              <button
                onClick={() =>
                  onStatusChange(
                    reservation.reservation_id,
                    ReservationStatus.COMPLETED
                  )
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                서비스 완료
              </button>
            )}
          </div>
        </div>
      ))}
      {reservationsWithDetails.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          예약 내역이 없습니다.
        </div>
      )}
    </div>
  );
}
