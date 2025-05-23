import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { services } from "@/data/service";
import { ServiceCategory } from "@/types/api";
import { serviceApi } from "@/app/api/service";
import { toast } from "react-toastify";
import { getTossPayments } from "@/lib/tossPayments";
import { useRouter } from "next/navigation";
import { paymentApi, CreatePaymentRequestDto } from "@/app/api/payment";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Pet, userApi } from "@/app/api/user/user";

interface PaymentStepProps {
  onNext: (notes: string) => void;
  onBack: () => void;
  serviceType: string;
  selectedDate: Date;
  selectedTime: string;
  selectedPetId: string;
  businessId: string;
  businessName: string;
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
}: PaymentStepProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [serviceData, petsData] = await Promise.all([
          serviceApi.getServiceById(serviceType),
          userApi.getMyPets(),
        ]);

        setServiceDetails(serviceData);
        const pet = petsData.find((p) => p.pet_id === selectedPetId);
        setSelectedPet(pet || null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceType && selectedPetId) {
      fetchData();
    }
  }, [serviceType, selectedPetId]);

  const servicePrice = serviceDetails?.price || 0;

  const getServiceName = (type: string): string => {
    if (serviceDetails?.name) {
      return serviceDetails.name;
    }
    const service = services.find((s) => s.service_id === type);
    if (service) {
      return service.name;
    }
    if (type.includes("-")) {
      const serviceById = services.find((s) => s.service_id === type);
      if (serviceById) {
        return serviceById.name;
      }
      return "서비스";
    }
    return type;
  };

  const handlePayment = async () => {
    if (!serviceDetails || !selectedPet) {
      toast.error("서비스 또는 반려동물 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      setIsProcessing(true);

      const startDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      const createPaymentDto: CreatePaymentRequestDto = {
        amount: Number(servicePrice),
        service_id: serviceType,
        business_id: businessId,
        pet_id: selectedPetId,
        start_time: startDate.toISOString(),
        notes: notes || undefined,
      };

      const response = await paymentApi.requestPayment(createPaymentDto);

      if (!response.success || !response.data) {
        throw new Error(response.message || "결제 요청에 실패했습니다.");
      }

      const paymentData = response.data;

      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
          "test_ck_DnyRpQWGrNbdwvRLRnqLrKwv1M9E"
      );

      await tossPayments.requestPayment("카드", {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        orderName: getServiceName(serviceType),
        customerName: selectedPet?.name || "고객",
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });
    } catch (error) {
      console.error("결제 요청 중 오류:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "결제 처리 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
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
                반려동물: {selectedPet?.name} ({selectedPet?.species})
                {selectedPet?.breed && ` - ${selectedPet.breed}`}
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
            disabled={isProcessing || isLoading}
            className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
              isProcessing || isLoading
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
