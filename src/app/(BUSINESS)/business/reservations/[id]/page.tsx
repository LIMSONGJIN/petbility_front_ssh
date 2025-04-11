"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Reservation, ReservationStatus } from "@/types/api";
import { businessReservationApi } from "@/api/business/business";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Dog,
  Package,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

// 확장된 예약 정보 타입 정의
interface ReservationWithDetails extends Reservation {
  customer_name?: string;
  customer_phone?: string;
  service_name?: string;
  reservation_date?: string;
  pet_name?: string;
  pet_type?: string;
  memo?: string;
}

export default function ReservationDetailPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<ReservationWithDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadReservation(params.id as string);
    }
  }, [params.id]);

  const loadReservation = async (id: string) => {
    try {
      const data = await businessReservationApi.getReservation(id);
      setReservation(data);
    } catch (error) {
      console.error("예약 정보를 불러오는데 실패했습니다:", error);
      toast.error("예약 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (status: ReservationStatus) => {
    if (!reservation) return;

    try {
      const updatedReservation =
        await businessReservationApi.updateReservationStatus(
          reservation.reservation_id,
          status
        );
      setReservation(updatedReservation);
      toast.success("예약 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("예약 상태 업데이트에 실패했습니다:", error);
      toast.error("예약 상태 업데이트에 실패했습니다.");
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ReservationStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case ReservationStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case ReservationStatus.CANCELED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return "대기중";
      case ReservationStatus.CONFIRMED:
        return "확정";
      case ReservationStatus.COMPLETED:
        return "완료";
      case ReservationStatus.CANCELED:
        return "취소";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6">
        <p className="text-gray-600">예약 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">예약 상세 정보</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              reservation.status
            )}`}
          >
            {getStatusText(reservation.status)}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">예약 날짜</p>
                <p className="text-gray-900">
                  {reservation.reservation_date
                    ? format(new Date(reservation.reservation_date), "PPP", {
                        locale: ko,
                      })
                    : format(new Date(reservation.start_time), "PPP", {
                        locale: ko,
                      })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">예약 시간</p>
                <p className="text-gray-900">
                  {reservation.start_time} - {reservation.end_time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">서비스</p>
                <p className="text-gray-900">{reservation.service_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">고객 정보</p>
                <p className="text-gray-900">{reservation.customer_name}</p>
                <p className="text-sm text-gray-600">
                  {reservation.customer_phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dog className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">반려동물</p>
                <p className="text-gray-900">
                  {reservation.pet_name} ({reservation.pet_type})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">결제 금액</p>
                <p className="text-gray-900">
                  {reservation.price.toLocaleString()}원
                </p>
              </div>
            </div>

            {reservation.memo && (
              <div>
                <p className="text-sm text-gray-500 mb-1">메모</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                  {reservation.memo}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {reservation.status === ReservationStatus.PENDING && (
              <>
                <button
                  onClick={() =>
                    handleStatusUpdate(ReservationStatus.CONFIRMED)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  예약 확정
                </button>
                <button
                  onClick={() => handleStatusUpdate(ReservationStatus.CANCELED)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  예약 취소
                </button>
              </>
            )}
            {reservation.status === ReservationStatus.CONFIRMED && (
              <button
                onClick={() => handleStatusUpdate(ReservationStatus.COMPLETED)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                서비스 완료
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
