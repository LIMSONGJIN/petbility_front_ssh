import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { mockReservationData } from "@/data/service";

interface PetSelectionStepProps {
  onNext: (petId: string) => void;
  onBack: () => void;
}

export default function PetSelectionStep({
  onNext,
  onBack,
}: PetSelectionStepProps) {
  const [selectedPetId, setSelectedPetId] = useState<string>("");

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
  };

  const handleNext = () => {
    if (selectedPetId) {
      onNext(selectedPetId);
    }
  };

  if (mockReservationData.pets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            반려동물 등록 필요
          </h2>
          <p className="text-gray-600 mb-6">
            등록된 반려동물이 없습니다. 서비스를 이용하시려면 반려동물을
            등록해주세요.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              이전으로
            </button>
            <button
              onClick={() => (window.location.href = "/pets/register")}
              className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
            >
              반려동물 등록하기
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">반려동물 선택</h2>
        <p className="text-gray-600 mb-6">
          서비스를 받을 반려동물을 선택해주세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReservationData.pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePetSelect(pet.id)}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPetId === pet.id
                  ? "border-violet-600 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pet.name}
                  </h3>
                  <p className="text-gray-600">
                    {pet.type} • {pet.breed}
                  </p>
                  <p className="text-gray-500 text-sm">{pet.age}세</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedPetId}
            className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
              selectedPetId
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
