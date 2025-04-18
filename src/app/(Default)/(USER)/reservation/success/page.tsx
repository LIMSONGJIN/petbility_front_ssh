"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReservationStore } from "@/store/reservationStore";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setReservationData } = useReservationStore();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const paymentKey = searchParams.get("paymentKey");
    const amount = searchParams.get("amount");
    const serviceId = searchParams.get("serviceId");
    const businessId = searchParams.get("businessId");
    const notes = searchParams.get("notes");

    if (!orderId || !paymentKey || !amount || !serviceId || !businessId) {
      console.error("결제 정보 누락:", {
        orderId,
        paymentKey,
        amount,
        serviceId,
        businessId,
      });
      router.push("/");
      return;
    }

    // 결제 데이터를 스토어에 저장
    setReservationData({
      serviceId,
      businessId,
      amount: Number(amount),
      notes: notes || "",
      paymentKey,
      orderId,
    });

    // 결제 성공 처리 로직
    const handlePaymentSuccess = async () => {
      try {
        // TODO: 여기에 결제 성공 후 필요한 API 호출 추가
        console.log("결제 성공:", {
          orderId,
          paymentKey,
          amount,
          serviceId,
          businessId,
          notes,
        });
      } catch (error) {
        console.error("결제 성공 처리 중 오류:", error);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, router, setReservationData]);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  if (!orderId || !amount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            결제 성공
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            결제가 성공적으로 완료되었습니다.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="border-t border-b py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              결제 정보
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">주문번호: {orderId}</p>
              <p className="text-sm text-gray-700">
                결제금액: {Number(amount).toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Link
            href="/reservations"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            예약 내역 확인하기
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
