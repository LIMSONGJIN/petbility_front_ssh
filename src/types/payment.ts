export interface PaymentMethod {
  method: "카드" | "가상계좌" | "계좌이체" | "휴대폰" | "토스페이";
  label: string;
}

export interface PaymentResult {
  orderId: string;
  amount: number;
  method: string;
  status: string;
  paymentKey: string;
  requestedAt: string;
  approvedAt: string;
  totalAmount?: number;
  methodName?: string;
  credits?: number;
  message?: string;
}
