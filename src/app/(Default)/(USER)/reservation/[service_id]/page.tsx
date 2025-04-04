"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AddressStep from "@/components/Service/AddressStep";
import DateTimeStep from "@/components/Service/DateTimeStep";
import PetSelectionStep from "@/components/Service/PetSelectionStep";
import PaymentStep from "@/components/Service/PaymentStep";
import CompletionStep from "@/components/Service/CompletionStep";
import { mockReservationData } from "@/data/service";

interface ReservationData {
  address: string;
  date: Date | null;
  time: string;
  petId: string;
  notes: string;
}

export default function ReservationPage() {
  const { service_id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData>({
    address: mockReservationData.userAddress.address,
    date: null,
    time: "",
    petId: "",
    notes: "",
  });
  const [reservationId, setReservationId] = useState("");

  const handleAddressChange = (newAddress: string) => {
    setReservationData((prev) => ({ ...prev, address: newAddress }));
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

  const handlePaymentComplete = (notes: string) => {
    setReservationData((prev) => ({ ...prev, notes }));
    // 실제 예약 ID 생성 로직은 여기에 구현
    setReservationId(`RES-${Date.now().toString().slice(-6)}`);
    // 결제 완료 후 다음 단계로 넘어가기
    setCurrentStep(5);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressStep
            onNext={() => setCurrentStep(2)}
            onAddressChange={handleAddressChange}
          />
        );
      case 2:
        return (
          <DateTimeStep
            onNext={handleDateTimeSelect}
            onBack={() => setCurrentStep(1)}
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
          />
        );
      case 5:
        return <CompletionStep reservationId={reservationId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {mockReservationData.reservationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < mockReservationData.reservationSteps.length - 1
                    ? "flex-1"
                    : ""
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
                {index < mockReservationData.reservationSteps.length - 1 && (
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
            {mockReservationData.reservationSteps.map((step) => (
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
