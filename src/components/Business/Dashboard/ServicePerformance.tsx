"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { serviceApi, reservationApi } from "@/api/business";
import { Service, Reservation } from "@/types/business";
import { dummyReservations } from "@/data/dummy/business";

interface ServiceWithGrowth extends Service {
  growth: number;
  bookings: number;
}

export default function ServicePerformance() {
  const [services, setServices] = useState<ServiceWithGrowth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // 서비스 목록 가져오기
        const servicesResponse = await serviceApi.getServices({
          page: 1,
          limit: 3,
          sort_by: "bookings",
          sort_order: "desc",
        });

        // 각 서비스의 예약 건수 계산
        const servicesWithGrowth = servicesResponse.data.map((service) => {
          // 해당 서비스의 예약 건수 계산
          const serviceReservations = dummyReservations.filter(
            (res) => res.service_id === service.service_id
          );

          // 최근 30일 예약 데이터 필터링
          const today = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          const recentReservations = serviceReservations.filter(
            (res) => new Date(res.reservation_date) >= thirtyDaysAgo
          );

          // 전반기(15일)와 후반기(15일) 예약 건수 계산
          const firstHalfReservations = recentReservations.filter(
            (res) =>
              new Date(res.reservation_date) <
              new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
          ).length;
          const secondHalfReservations =
            recentReservations.length - firstHalfReservations;

          // 성장률 계산
          const growth =
            firstHalfReservations === 0
              ? 100
              : Math.round(
                  ((secondHalfReservations - firstHalfReservations) /
                    firstHalfReservations) *
                    100
                );

          return {
            ...service,
            bookings: serviceReservations.length,
            growth,
          };
        });

        setServices(servicesWithGrowth);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <motion.div
          key={service.service_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <TrendingUp
                  className={`w-4 h-4 ${
                    service.growth >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    service.growth >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {service.growth >= 0 ? "+" : ""}
                  {service.growth}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              ₩{service.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{service.bookings}건 예약</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
