"use client";

import { useEffect, useState } from "react";
import { Reservation, ReservationStatus } from "@/types/api";
import { businessReservationApi } from "@/app/api/business/business";
import { userApi } from "@/app/api/auth";
import { ReservationList } from "@/components/Business/Reservation/ReservationList";
import BusinessSchedule from "@/components/Business/Reservation/BusinessSchedule";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Schedule {
  startTime: string;
  endTime: string;
  breakTime: {
    start: string;
    end: string;
  };
  selectedDays: boolean[];
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "schedule">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ReservationStatus>(
    "all"
  );
  const [businessId, setBusinessId] = useState<string>("");
  const [schedule, setSchedule] = useState<Schedule>({
    startTime: "09:00",
    endTime: "18:00",
    breakTime: {
      start: "12:00",
      end: "13:00",
    },
    selectedDays: [true, true, true, true, true, true, false],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 현재 사용자 정보 가져오기
      const userResponse = await userApi.getCurrentUser();
      setBusinessId(userResponse.user_id);

      // 예약 목록 가져오기
      const reservationsResponse =
        await businessReservationApi.getReservations();
      setReservations(
        Array.isArray(reservationsResponse.data)
          ? reservationsResponse.data
          : []
      );
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = async (newSchedule: Schedule) => {
    setSchedule(newSchedule);
    // TODO: API 연동
    // await updateBusinessSchedule(newSchedule);
  };

  const handleStatusChange = async (
    reservationId: string,
    newStatus: ReservationStatus
  ) => {
    try {
      await businessReservationApi.updateReservationStatus(
        reservationId,
        newStatus
      );
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservation_id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
      toast.success("예약 상태가 변경되었습니다.");
    } catch (error) {
      console.error("예약 상태 변경 실패:", error);
      toast.error("예약 상태를 변경하는데 실패했습니다.");
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const statusMatch =
      filterStatus === "all" || reservation.status === filterStatus;

    // 예약한 사용자 정보 가져오기
    const reservationDetails = async () => {
      try {
        // 여기서 실제로는 reservation.user_id를 사용하여 사용자 정보를 조회하는 API 호출이 필요함
        return null;
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        return null;
      }
    };

    // 기본 검색은 예약 ID와 메모 검색으로 대체
    const matchesSearch =
      searchQuery === "" ||
      reservation.reservation_id.includes(searchQuery) ||
      (reservation.notes &&
        reservation.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && matchesSearch;
  });

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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">예약 관리</h1>
        <div className="flex gap-2 text-violet-500">
          <Button
            variant={activeTab === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("list")}
          >
            예약 목록
          </Button>
          <Button
            variant={activeTab === "schedule" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("schedule")}
          >
            예약 가능 시간 설정
          </Button>
        </div>
      </div>

      {activeTab === "list" ? (
        <>
          <div className="flex gap-2 mb-6">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              전체
            </Button>
            <Button
              variant={
                filterStatus === ReservationStatus.PENDING
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(ReservationStatus.PENDING)}
            >
              결제 대기
            </Button>
            <Button
              variant={
                filterStatus === ReservationStatus.CONFIRMED
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(ReservationStatus.CONFIRMED)}
            >
              예약 확정
            </Button>
            <Button
              variant={
                filterStatus === ReservationStatus.COMPLETED
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(ReservationStatus.COMPLETED)}
            >
              서비스 완료
            </Button>
            <Button
              variant={
                filterStatus === ReservationStatus.CANCELED
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(ReservationStatus.CANCELED)}
            >
              예약 취소
            </Button>
          </div>

          <ReservationList
            reservations={filteredReservations}
            onStatusChange={handleStatusChange}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </>
      ) : (
        <BusinessSchedule
          schedule={schedule}
          onScheduleChange={handleScheduleChange}
          businessId={businessId}
        />
      )}
    </div>
  );
}
