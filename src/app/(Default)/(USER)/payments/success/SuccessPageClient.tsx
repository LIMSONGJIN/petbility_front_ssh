"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentApi } from "@/app/api/payment";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SuccessPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const paymentKey = searchParams.get("paymentKey");
        const amount = searchParams.get("amount");

        if (!orderId || !paymentKey || !amount) {
          throw new Error("필수 결제 정보가 누락되었습니다.");
        }

        // 결제 승인 처리
        const response = await paymentApi.approvePayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        if (!response.success) {
          throw new Error(response.message || "결제 승인에 실패했습니다.");
        }

        // 결제 성공 메시지 표시
        toast.success("결제가 성공적으로 완료되었습니다.");

        // 예약 ID가 있으면 예약 내역 페이지로, 없으면 홈으로 이동
        setTimeout(() => {
          if (response.data.reservation_id) {
            router.push("/reservations");
          } else {
            toast.warning("예약 생성에 실패했습니다. 관리자에게 문의해주세요.");
            router.push("/");
          }
        }, 3000);
      } catch (error) {
        console.error("결제 승인 처리 중 오류:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다."
        );
        // 3초 후 홈으로 이동
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-600 rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              결제 처리 중...
            </h2>
            <p className="text-gray-600">
              잠시만 기다려주세요. 결제를 확인하고 있습니다.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              결제가 완료되었습니다
            </h2>
            <p className="text-gray-600 mb-6">예약 내역 페이지로 이동합니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
