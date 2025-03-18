import { loadTossPayments } from "@tosspayments/payment-sdk"; // ✅ named import

export function getTossPayments() {
  return loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
}
