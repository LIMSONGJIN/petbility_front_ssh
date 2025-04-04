"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reservation, PaginationParams } from "@/types/business";
import { reservationApi } from "@/api/business";
import { ReservationList } from "@/components/Business/Reservation/ReservationList";
import BusinessSchedule from "@/components/Business/Reservation/BusinessSchedule";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

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
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "schedule">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
      const params: PaginationParams = {
        page: 1,
        limit: 10,
      };
      const response = await reservationApi.getReservations(params);
      setReservations(response.data);
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error);
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
    newStatus: Reservation["status"]
  ) => {
    try {
      await reservationApi.updateReservationStatus(reservationId, newStatus);
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
    const customerMatch = !customerId || reservation.customer_id === customerId;
    const matchesSearch =
      searchQuery === "" ||
      reservation.customer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.customer_phone.includes(searchQuery) ||
      reservation.pet_name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && customerMatch && matchesSearch;
  });

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
        <h1 className="text-2xl font-bold">
          {customerId ? "고객 예약 내역" : "예약 관리"}
        </h1>
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
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              결제 대기
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("confirmed")}
            >
              예약 확정
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              서비스 완료
            </Button>
            <Button
              variant={filterStatus === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("cancelled")}
            >
              예약 취소
            </Button>
          </div>
          <ReservationList
            reservations={filteredReservations}
            onSearchChange={setSearchQuery}
            onStatusChange={setFilterStatus}
            onStatusUpdate={handleStatusChange}
          />
        </>
      ) : (
        <BusinessSchedule
          schedule={schedule}
          onScheduleChange={handleScheduleChange}
        />
      )}
    </div>
  );
}
