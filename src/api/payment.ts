import { api } from "./axios";

export interface PaymentRequestData {
  service_id: string;
  business_id: string;
  amount: number;
  pet_id: string;
  start_time: string;
  end_time?: string;
  notes?: string;
}

export interface PaymentRequestResponse {
  orderId: string;
  amount: number;
  orderName: string;
  ordererEmail: string;
  ordererName: string;
  successUrl: string;
  failUrl: string;
  serviceData: {
    service_id: string;
    business_id: string;
    pet_id: string;
    start_time: string;
    end_time?: string;
    notes?: string;
  };
}

export interface PaymentApproveData {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentApproveResponse {
  orderId: string;
  paymentKey: string;
  status: string;
  totalAmount: number;
  balanceAmount: number;
  approvedAt: string;
  method: string;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useInternationalCardOnly: boolean;
  };
  virtualAccount?: {
    accountNumber: string;
    accountType: string;
    bankCode: string;
    customerName: string;
    dueDate: string;
  };
  transfer?: {
    bankCode: string;
    accountHolder: string;
  };
}

export interface PaymentCancelData {
  cancel_reason: string;
  cancel_amount: string;
}

export interface PaymentResponse {
  payment_url: string;
  orderId: string;
  amount: string;
}

export interface PaymentConfirmResponse {
  payment_id: string;
  paymentKey: string;
  orderId: string;
  amount: string;
  method: string;
  status: string;
  receipt_url: string;
  reservation_id: string;
}

export interface PaymentCancelResponse {
  payment_id: string;
  status: string;
  cancel_reason: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  status: string;
  amount: string;
  created_at: string;
}

export interface PaymentHistoryResponse {
  payments: {
    payment_id: string;
    orderId: string;
    amount: string;
    status: string;
    created_at: string;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TossPaymentApproveData {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentApproveResponse {
  version: string;
  paymentKey: string;
  type: string;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: string;
  totalAmount: number;
  balanceAmount: number;
  status: string;
  requestedAt: string;
  approvedAt: string;
  useInternational: boolean;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useCardSort: boolean;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    receiptUrl: string;
  };
  virtualAccount?: {
    accountNumber: string;
    accountType: string;
    bankCode: string;
    bankName: string;
    customerName: string;
    dueDate: string;
    expired: boolean;
  };
  secret?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const paymentApi = {
  // 결제 요청 생성
  requestPayment: async (
    data: PaymentRequestData
  ): Promise<PaymentRequestResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/payments/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 요청에 실패했습니다.");
    }

    return response.json();
  },

  // 결제 승인 처리
  approvePayment: async (
    data: PaymentApproveData
  ): Promise<PaymentApproveResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    console.log("결제 승인 API 요청:", {
      url: `${API_URL}/payments/approve`,
      data: data,
    });

    const response = await fetch(`${API_URL}/payments/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("결제 승인 API 오류:", errorData);
      throw new Error(errorData.message || "결제 승인에 실패했습니다.");
    }

    const result = await response.json();
    console.log("결제 승인 API 응답:", result);
    return result;
  },

  // 결제 취소
  cancelPayment: async (
    paymentId: string,
    data: PaymentCancelData
  ): Promise<PaymentCancelResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 취소에 실패했습니다.");
    }

    return response.json();
  },

  // 결제 상태 조회
  getPaymentStatus: async (
    paymentId: string
  ): Promise<PaymentStatusResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/payments/${paymentId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 상태 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 결제 내역 조회
  getPaymentHistory: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaymentHistoryResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(
      `${API_URL}/payments/history?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 내역 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 결제 재시도
  retryPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/payments/${paymentId}/retry`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 재시도에 실패했습니다.");
    }

    return response.json();
  },

  // 토스 페이먼츠 결제 승인 API 호출
  approveTossPayment: async (
    data: TossPaymentApproveData
  ): Promise<TossPaymentApproveResponse> => {
    const token =
      process.env.NEXT_PUBLIC_TOSS_SECRET_KEY ||
      "test_sk_D4yKeq5bgrpKRd0Jg6X8LQKzRZg";

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(token + ":").toString("base64")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "결제 승인에 실패했습니다.");
    }

    return response.json();
  },
};
