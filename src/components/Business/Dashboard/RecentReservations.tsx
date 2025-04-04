"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, User, Phone, MapPin } from "lucide-react";
import { reservationApi } from "@/api/business";
import { Reservation } from "@/types/business";

export default function RecentReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await reservationApi.getReservations({
          page: 1,
          limit: 5,
          sort_by: "date",
          sort_order: "desc",
        });
        setReservations(response.data);
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          최근 예약 현황
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        최근 예약 현황
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">고객 정보</th>
              <th className="pb-3 font-medium">서비스</th>
              <th className="pb-3 font-medium">예약 시간</th>
              <th className="pb-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <motion.tr
                key={reservation.reservation_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {reservation.customer_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {reservation.customer_phone || "연락처 정보 없음"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-gray-900">
                    {reservation.service_name}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {reservation.start_time} {reservation.end_time}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      reservation.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : reservation.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {reservation.status === "completed"
                      ? "완료"
                      : reservation.status === "cancelled"
                      ? "취소"
                      : reservation.status === "pending"
                      ? "대기"
                      : "확정"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
