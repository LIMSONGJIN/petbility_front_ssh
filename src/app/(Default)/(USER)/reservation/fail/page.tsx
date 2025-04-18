"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentFailPage() {
  const router = useRouter();
  const [errorInfo, setErrorInfo] = useState({
    reason: "알 수 없는 오류가 발생했습니다.",
    orderId: "",
    code: "",
  });

  useEffect(() => {
    // URL에서 쿼리 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const message = urlParams.get("message");
    const orderId = urlParams.get("orderId");

    // 실패 정보 설정 및 로그
    const error = {
      reason: message || "알 수 없는 오류가 발생했습니다.",
      orderId,
      code,
      allParams: Object.fromEntries(urlParams.entries()),
    };

    console.error("결제 실패:", error);
    setErrorInfo({
      reason: error.reason,
      orderId: error.orderId || "",
      code: error.code || "",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            결제 실패
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            결제 처리 중 문제가 발생했습니다.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="border-t border-b py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              오류 정보
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">오류: {errorInfo.reason}</p>
              {errorInfo.code && (
                <p className="text-sm text-gray-700">
                  오류 코드: {errorInfo.code}
                </p>
              )}
              {errorInfo.orderId && (
                <p className="text-sm text-gray-700">
                  주문번호: {errorInfo.orderId}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            홈으로 돌아가기
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
