"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, MapPin, Calendar, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

import { customerApi, reservationApi } from "@/api/business";
import { Customer, Reservation } from "@/types/business";

export default function CustomerDetailPage() {
  const { user_id } = useParams();

  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user_id) return;

    const fetchData = async () => {
      try {
        const [customerData, reservationData] = await Promise.all([
          customerApi.getCustomer(user_id as string),
          reservationApi.getReservations({
            customer_id: user_id as string,
            page: 1,
            limit: 10,
          }),
        ]);

        setCustomer(customerData);
        setReservations(reservationData.data);
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  if (isLoading || !customer) {
    return <div className="max-w-6xl mx-auto p-6">로딩 중...</div>;
  }

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
        return "대기 중";
      case "confirmed":
        return "확정됨";
      case "completed":
        return "완료됨";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">고객 상세 정보</h1>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 고객 정보 카드 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">{customer.name}</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    가입일:{" "}
                    {format(new Date(customer.created_at), "yyyy.MM.dd", {
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 예약 내역 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">예약 내역</h2>
              </div>

              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.reservation_id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">
                          {reservation.service_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(
                            new Date(reservation.created_at),
                            "yyyy.MM.dd HH:mm",
                            {
                              locale: ko,
                            }
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-sm ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </div>
                    <div className="text-sm">
                      가격: {reservation.price.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
