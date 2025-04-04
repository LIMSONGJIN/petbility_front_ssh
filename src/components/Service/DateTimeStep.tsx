import { useState } from "react";
import { motion } from "framer-motion";
import { mockReservationData } from "@/data/service";
import Calendar from "@/components/ClientCalender";

interface DateTimeStepProps {
  onNext: (date: Date, time: string) => void;
  onBack: () => void;
}

export default function DateTimeStep({ onNext, onBack }: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showNoAvailability, setShowNoAvailability] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    // 목업 데이터에서는 모든 날짜에 시간이 있다고 가정
    setShowNoAvailability(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext(selectedDate, selectedTime);
      // 부모 컴포넌트에서 currentStep을 증가시키도록 수정됨
    }
  };

  if (showNoAvailability) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">예약 불가</h2>
          <p className="text-gray-600 mb-6">
            선택하신 날짜에는 예약 가능한 시간이 없습니다.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              이전으로
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
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
          날짜 및 시간 선택
        </h2>

        <div className="mb-6">
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                handleDateSelect(value);
              }
            }}
            value={selectedDate}
            minDate={new Date()}
            className="rounded-lg border shadow-sm"
          />
        </div>

        {selectedDate && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">오전</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mockReservationData.availableTimeSlots.morning.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg border ${
                    selectedTime === time
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-violet-500"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mt-6">오후</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mockReservationData.availableTimeSlots.afternoon.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg border ${
                    selectedTime === time
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-violet-500"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
              selectedDate && selectedTime
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음으로
          </button>
        </div>
      </div>
    </motion.div>
  );
}
