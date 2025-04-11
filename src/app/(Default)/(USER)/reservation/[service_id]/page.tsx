"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import BusinessSelectionStep from "@/components/Service/BusinessSelectionStep";
import DateTimeStep from "@/components/Service/DateTimeStep";
import PetSelectionStep from "@/components/Service/PetSelectionStep";
import PaymentStep from "@/components/Service/PaymentStep";
import CompletionStep from "@/components/Service/CompletionStep";
import { mockReservationData } from "@/data/service";
import { userReservationApi } from "@/api/user/user";
import { Business, ServiceWithBusiness } from "@/api/user/user";
import { toast } from "react-toastify";
import { CreateReservationData } from "@/types/api";

interface ReservationData {
  business_id: string;
  business_name: string;
  date: Date | null;
  time: string;
  petId: string;
  notes: string;
}

export default function ReservationPage() {
  const { service_id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData>({
    business_id: "",
    business_name: "",
    date: null,
    time: "",
    petId: "",
    notes: "",
  });
  const [reservationId, setReservationId] = useState("");
  const [serviceBusinesses, setServiceBusinesses] = useState<
    ServiceWithBusiness[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceName, setServiceName] = useState("");

  // 서비스 상세 및 사업자 목록 불러오기
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        // 서비스 상세 정보 로드
        try {
          const serviceData = await userReservationApi.getAllServices();
          const service = serviceData.find((s) => s.service_id === service_id);
          if (service) {
            setServiceName(service.name);
          }
        } catch (error) {
          console.error("Failed to fetch service:", error);
        }

        // 사업자 목록 로드
        const data = await userReservationApi.getBusinessesByServiceId(
          service_id as string
        );
        setServiceBusinesses(data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        toast.error("사업자 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (service_id) {
      fetchBusinesses();
    }
  }, [service_id]);

  const handleBusinessSelect = (businessId: string, businessName: string) => {
    setReservationData((prev) => ({
      ...prev,
      business_id: businessId,
      business_name: businessName,
    }));
    // 사업자 선택 후 다음 단계로 넘어가기
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setReservationData((prev) => ({ ...prev, date, time }));
    // 날짜와 시간 선택 후 다음 단계로 넘어가기
    setCurrentStep(3);
  };

  const handlePetSelect = (petId: string) => {
    setReservationData((prev) => ({ ...prev, petId }));
    // 반려동물 선택 후 다음 단계로 넘어가기
    setCurrentStep(4);
  };

  const handlePaymentComplete = async (notes: string) => {
    try {
      setReservationData((prev) => ({ ...prev, notes }));

      // API 호출하여 예약 생성
      const startTime = `${reservationData.date?.toISOString().split("T")[0]}T${
        reservationData.time
      }:00`;
      // 서비스 시간을 1시간으로 가정
      const endTimeDate = new Date(
        new Date(startTime).getTime() + 60 * 60 * 1000
      );
      const endTime = endTimeDate.toISOString();

      const result = await userReservationApi.createReservation({
        service_id: service_id as string,
        pet_id: reservationData.petId,
        start_time: startTime,
        end_time: endTime,
        notes: notes,
        business_id: reservationData.business_id,
      });

      // 예약 ID 설정
      setReservationId(result.reservation_id);
      // 결제 완료 후 다음 단계로 넘어가기
      setCurrentStep(5);
    } catch (error) {
      console.error("Failed to create reservation:", error);
      toast.error("예약 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessSelectionStep
            serviceBusinesses={serviceBusinesses}
            isLoading={isLoading}
            onNext={handleBusinessSelect}
          />
        );
      case 2:
        return (
          <DateTimeStep
            onNext={handleDateTimeSelect}
            onBack={() => setCurrentStep(1)}
            businessId={reservationData.business_id}
            serviceId={service_id as string}
          />
        );
      case 3:
        return (
          <PetSelectionStep
            onNext={handlePetSelect}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <PaymentStep
            onNext={handlePaymentComplete}
            onBack={() => setCurrentStep(3)}
            serviceType={service_id as string}
            selectedDate={reservationData.date!}
            selectedTime={reservationData.time}
            selectedPetId={reservationData.petId}
            businessName={reservationData.business_name}
          />
        );
      case 5:
        return <CompletionStep reservationId={reservationId} />;
      default:
        return null;
    }
  };

  // 예약 단계 이름 업데이트
  const reservationSteps = [
    { id: 1, title: "서비스 제공자" },
    { id: 2, title: "날짜 및 시간" },
    { id: 3, title: "반려동물 선택" },
    { id: 4, title: "메모 및 결제" },
    { id: 5, title: "예약 완료" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {serviceName && (
          <h1 className="text-2xl font-bold text-center mb-6 text-violet-700">
            {serviceName} 예약
          </h1>
        )}

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {reservationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < reservationSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-violet-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                {index < reservationSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? "bg-violet-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {reservationSteps.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  currentStep >= step.id
                    ? "text-violet-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 컴포넌트 */}
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
