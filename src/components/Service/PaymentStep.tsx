import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockReservationData, services } from "@/data/service";
import { ServiceCategory } from "@/types/api";
import { serviceApi } from "@/app/api/service";
import { toast } from "react-toastify";
import { getTossPayments } from "@/lib/tossPayments";
import { useRouter } from "next/navigation";
import { useReservationStore } from "@/store/reservationStore";
import { paymentApi } from "@/app/api/payment";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface PaymentStepProps {
  onNext: (notes: string) => void;
  onBack: () => void;
  serviceType: string;
  selectedDate: Date;
  selectedTime: string;
  selectedPetId: string;
  businessId: string;
  businessName: string;
  reservationId?: string;
}

export default function PaymentStep({
  onNext,
  onBack,
  serviceType,
  selectedDate,
  selectedTime,
  selectedPetId,
  businessId,
  businessName,
  reservationId,
}: PaymentStepProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setReservationData } = useReservationStore();

  // 서비스 정보 불러오기
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setIsLoading(true);
        const data = await serviceApi.getServiceById(serviceType);
        setServiceDetails(data);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
        toast.error("서비스 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceType) {
      fetchServiceDetails();
    }
  }, [serviceType]);

  const selectedPet = mockReservationData.pets.find(
    (pet) => pet.id === selectedPetId
  );

  const servicePrice =
    serviceDetails?.price ||
    mockReservationData.servicePrices[
      serviceType as keyof typeof mockReservationData.servicePrices
    ] ||
    0;

  // 서비스 타입을 사용자가 이해하기 쉬운 이름으로 매핑
  const getServiceName = (type: string): string => {
    // 서비스 상세 정보가 로드된 경우
    if (serviceDetails?.name) {
      return serviceDetails.name;
    }

    // 서비스 ID로 서비스 목록에서 찾기
    const service = services.find((s) => s.service_id === type);
    if (service) {
      return service.name;
    }

    // 서비스 카테고리로 매핑
    switch (type) {
      case ServiceCategory.FUNERAL:
        return "장례 서비스";
      case ServiceCategory.CREMATION:
        return "화장 서비스";
      case ServiceCategory.GROOMING:
        return "미용 서비스";
      case ServiceCategory.BATHING:
        return "목욕 서비스";
      case ServiceCategory.CUSTOM_VEHICLES:
        return "맞춤 차량 서비스";
      case ServiceCategory.OTHER_CARE:
        return "기타 케어 서비스";
      default:
        // UUID 형식인 경우 서비스 ID로 처리
        if (type.includes("-")) {
          // 서비스 ID로 서비스 목록에서 찾기
          const serviceById = services.find((s) => s.service_id === type);
          if (serviceById) {
            return serviceById.name;
          }
          return "서비스";
        }
        return type;
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // 서비스 시작 시간 계산
      const startDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      startDate.setHours(hours, minutes);

      // 결제 요청 API 호출
      const paymentRequest = await paymentApi.requestPayment({
        service_id: serviceType,
        business_id: businessId,
        amount: Number(servicePrice),
        pet_id: selectedPetId,
        start_time: startDate.toISOString(),
        notes: notes,
      });

      // 토스페이먼츠 결제창 열기
      const tossPayments = await getTossPayments();

      await tossPayments.requestPayment("카드", {
        amount: paymentRequest.amount,
        orderId: paymentRequest.orderId,
        orderName: getServiceName(serviceType),
        customerName: paymentRequest.ordererName,
        customerEmail: paymentRequest.ordererEmail,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    } catch (error) {
      console.error("결제 요청 중 오류:", error);
      toast.error("결제 처리 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="ml-3">예약 정보 로딩 중...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          예약 정보 확인
        </h2>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">예약 정보</h3>
            <div className="space-y-2 text-gray-600">
              <p>업체: {businessName}</p>
              <p>날짜: {formatDate(selectedDate)}</p>
              <p>시간: {selectedTime}</p>
              <p>
                반려동물: {selectedPet?.name} ({selectedPet?.type})
              </p>
              <p>서비스: {getServiceName(serviceType)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">결제 금액</h3>
            <p className="text-2xl font-bold text-violet-600">
              {servicePrice.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            특이사항 (선택)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="서비스 이용 시 참고할 특이사항을 입력해주세요."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700"
            } text-white`}
          >
            {isProcessing ? "결제 처리 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
