import { getSession } from "next-auth/react";

// --- [Request DTOs] ---
export interface CreatePaymentRequestDto {
  amount: number;
  service_id: string;
  business_id: string;
  pet_id: string;
  start_time: string; // ISO-8601 UTC
  notes?: string;
}

export interface ApprovePaymentDto {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface CancelPaymentDto {
  cancel_reason: string;
}

// --- [Response DTOs] ---
interface PaymentMetadata {
  pet_id: string;
  start_time: string;
  notes?: string;
  service_name?: string;
  service_price?: number;
  method_detail?: string;
  receipt_url?: string;
  toss_payment_response?: any;
  [key: string]: any;
}

export interface PaymentResponseBase {
  payment_id: string;
  user_id: string;
  amount: number;
  status: string; // PaymentStatus enum (PENDING, DONE, CANCELED, FAILED)
  method: string; // PaymentMethod enum (CARD, VIRTUAL_ACCOUNT, ETC)
  service_id: string;
  business_id: string;
  orderId: string;
  metadata: PaymentMetadata;
  created_at: string; // ISO-8601
  updated_at: string; // ISO-8601
  approved_at?: string | null; // ISO-8601
  canceled_at?: string | null; // ISO-8601
  cancel_reason?: string | null;
  paymentKey?: string | null;
}

export interface CreatePaymentResponseData extends PaymentResponseBase {
  paymentKey: string; // TOSS_CLIENT_KEY
  successUrl: string;
  failUrl: string;
}

export interface ApprovePaymentResponseData extends PaymentResponseBase {
  reservation_id?: string | null;
}

export interface CancelPaymentResponseData {
  ok: boolean;
}

// --- [API Response Wrapper] ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- [API URL & Auth] ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getAuthToken = async () => {
  const session = await getSession();
  if (!session?.user?.jwt) {
    throw new Error("인증 토큰이 없습니다.");
  }
  return session.user.jwt;
};

// --- [API Functions] ---
export const paymentApi = {
  // 결제 요청 생성
  requestPayment: async (
    dto: CreatePaymentRequestDto
  ): Promise<ApiResponse<CreatePaymentResponseData>> => {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/payments/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error("결제 요청 API 오류:", responseData);
      throw new Error(responseData.message || "결제 요청에 실패했습니다.");
    }
    return responseData;
  },

  // 결제 승인 처리
  approvePayment: async (
    dto: ApprovePaymentDto
  ): Promise<ApiResponse<ApprovePaymentResponseData>> => {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/payments/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error("결제 승인 API 오류:", responseData);
      throw new Error(responseData.message || "결제 승인에 실패했습니다.");
    }
    return responseData;
  },

  // 결제 취소
  cancelPayment: async (
    paymentId: string,
    dto: CancelPaymentDto
  ): Promise<ApiResponse<CancelPaymentResponseData>> => {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error("결제 취소 API 오류:", responseData);
      throw new Error(responseData.message || "결제 취소에 실패했습니다.");
    }
    return responseData;
  },
};
