"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Edit3, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { petsList, reservations, times } from "@/data/service";

const availableTimes = times;

const services = reservations;

const pets = petsList;

export default function ReservationForm() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservationData = {
      reservation_id: crypto.randomUUID(),
      user_id: "user-101",
      service_id: selectedService,
      business_id:
        services.find((s) => s.service_id === selectedService)?.business_id ||
        "",
      pet_id: selectedPet,
      date,
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
        반려동물 서비스 예약
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto"
      >
        {/* 서비스 선택 */}
        <label className="block text-gray-700 font-semibold mb-2">
          서비스 선택
        </label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">서비스를 선택하세요</option>
          {services.map((service) => (
            <option key={service.service_id} value={service.service_id}>
              {service.name}
            </option>
          ))}
        </select>

        {/* 반려동물 선택 */}
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
          {pets.map((pet) => (
            <option key={pet.pet_id} value={pet.pet_id}>
              {pet.name} ({pet.type})
            </option>
          ))}
        </select>

        {/* 날짜 선택 */}
        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" /> 예약 날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        {/* 시간 선택 */}
        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
          <Clock size={18} className="text-gray-500" /> 예약 시간
        </label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">시간을 선택하세요</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* 추가 요청 사항 */}
        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
          <Edit3 size={18} className="text-gray-500" /> 추가 요청 사항
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="추가 요청 사항을 입력하세요 (선택 사항)"
          rows={3}
        />

        {/* 예약 버튼 */}
        <motion.button
          type="submit"
          className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg shadow-lg hover:bg-violet-700 transition flex justify-center items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Send size={18} /> 예약하기
        </motion.button>
      </form>
    </section>
  );
}
