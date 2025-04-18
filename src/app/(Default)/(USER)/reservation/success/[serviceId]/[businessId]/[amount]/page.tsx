"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReservationStore } from "@/store/reservationStore";
import { paymentApi } from "@/api/payment";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { setReservationData } = useReservationStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const { serviceId, businessId, amount } = params;
        const searchParams = new URLSearchParams(window.location.search);
        const orderId = searchParams.get("orderId");
        const paymentKey = searchParams.get("paymentKey");
        const notes = searchParams.get("notes") || "";

        if (!paymentKey || !orderId || !amount || !serviceId || !businessId) {
          console.error("필수 결제 정보가 없습니다.");
          router.push("/");
          return;
        }

        // 결제 승인 API 호출
        const result = await paymentApi.approvePayment({
          paymentKey: paymentKey,
          orderId: orderId,
          amount: Number(amount),
        });

        // 예약 데이터 저장
        const reservationData = {
          serviceId: serviceId,
          businessId: businessId,
          amount: result.totalAmount,
          orderId: result.orderId,
          paymentKey: result.paymentKey,
          status: result.status,
          notes: notes,
        };

        // 예약 데이터를 로컬 스토리지에 저장
        localStorage.setItem(
          "reservationData",
          JSON.stringify(reservationData)
        );

        // 예약 완료 페이지로 이동
        router.push("/reservation/complete");
      } catch (error) {
        console.error("결제 승인 중 오류:", error);
        toast.error("결제 승인 중 오류가 발생했습니다.");
        router.push("/reservation/fail");
      }
    };

    handlePaymentSuccess();
  }, [params, router, setReservationData]);

  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");
  const amount = params.amount;

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              결제 처리 중
            </h2>
            <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요...</p>
          </div>
          <div className="flex justify-center mt-6">
            <div className="w-10 h-10 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

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
              {paymentResult && (
                <>
                  <p className="text-sm text-gray-700">
                    결제방법: {paymentResult.method}
                  </p>
                  <p className="text-sm text-gray-700">
                    예약번호: {paymentResult.reservation_id}
                  </p>
                  {paymentResult.receipt_url && (
                    <a
                      href={paymentResult.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:text-violet-800"
                    >
                      영수증 보기
                    </a>
                  )}
                </>
              )}
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
