"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Clock, Edit3, Send } from "lucide-react";
import { motion } from "framer-motion";
import { services, petsList } from "@/data/service";

export default function ReservationDetailPage() {
  const { service_id } = useParams();
  const selectedService = services.find(
    (s) => s.service_id === String(service_id)
  );

  // ✅ 클라이언트에서만 `date` 상태를 업데이트
  const [selectedPet, setSelectedPet] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ 클라이언트 여부 확인

  useEffect(() => {
    setMounted(true); // ✅ 클라이언트에서 마운트되었음을 확인
  }, []);

  if (!selectedService) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">
          해당 서비스 정보를 찾을 수 없습니다.
        </h1>
      </div>
    );
  }

  // 예약 가능 시간 가져오기
  const availableTimes = selectedService.available_time?.length
    ? selectedService.available_time
    : [];

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    setIsFormVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservationData = {
      reservation_id: crypto.randomUUID(),
      user_id: "user-101",
      service_id,
      business_id: selectedService.business_id,
      pet_id: selectedPet,
      date: date?.toISOString().split("T")[0],
      time,
      status: "PENDING",
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("📌 예약 데이터:", reservationData);
    alert("예약이 완료되었습니다!");
  };

  return (
    <section className="container mx-auto py-8 px-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        {selectedService.name} 예약하기
      </h2>
      <p className="text-lg text-gray-600 text-center mb-6">
        {selectedService.description}
      </p>

      {/* 📌 예약 날짜 선택 */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        <label className="block text-gray-700 font-semibold mb-6">
          예약 날짜 선택
        </label>

        {/* ✅ 클라이언트에서만 Calendar 렌더링 */}
        {mounted && (
          <Calendar
            onChange={(date) => setDate(date as Date)}
            value={date}
            locale="ko-KR" // ✅ 한국어 설정으로 서버 & 클라이언트 불일치 해결
            className="w-full border border-gray-300 rounded-md p-2 mx-auto"
            minDate={new Date()} // 오늘 이후만 선택 가능
            formatDay={(locale, date) => date.getDate().toString()}
          />
        )}
      </div>

      {/* 시간 선택 */}
      {date && availableTimes.length > 0 && (
        <>
          <label className="text-gray-700 font-semibold my-4 flex justify-center items-center gap-2">
            <Clock size={18} className="text-gray-500" /> 예약 가능 시간대
          </label>
          <div className="flex w-full justify-center gap-3 mt-2">
            {availableTimes.map((t) => (
              <button
                key={t}
                onClick={() => handleTimeSelect(t)}
                className={`px-4 py-2 rounded-md border transition ease-linear ${
                  time === t
                    ? "bg-violet-600 text-white"
                    : "bg-white hover:bg-violet-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 예약 폼 */}
      {isFormVisible && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto mt-6"
        >
          <label className="block text-gray-700 font-semibold mb-2">
            반려동물 선택
          </label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">반려동물을 선택하세요</option>
            {petsList.map((pet) => (
              <option key={pet.pet_id} value={pet.pet_id}>
                {pet.name} ({pet.type})
              </option>
            ))}
          </select>

          <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
            <Edit3 size={18} className="text-gray-500" /> 추가 요청 사항
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="추가 요청 사항을 입력하세요 (선택 사항)"
            rows={3}
          />

          <motion.button
            type="submit"
            className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg shadow-lg flex justify-center items-center gap-2"
            whileHover={{ scale: 1.02, backgroundColor: "#6d28d9" }}
            transition={{ duration: 0.3 }}
          >
            <Send size={18} /> 예약하기
          </motion.button>
        </motion.form>
      )}
    </section>
  );
}
