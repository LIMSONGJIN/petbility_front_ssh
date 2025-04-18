import { loadTossPayments } from "@tosspayments/payment-sdk"; // ✅ named import

// 환경 변수에 키가 없을 경우 기본값 사용
export function getTossPayments() {
  const clientKey =
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
    "test_ck_DnyRpQWGrNbdwvRLRnqLrKwv1M9E";
  return loadTossPayments(clientKey);
}
