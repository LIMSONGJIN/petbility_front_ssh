"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pet, userApi } from "@/app/api/user/user";
import { toast } from "react-toastify";

interface PetSelectionStepProps {
  onNext: (petId: string) => void;
  onBack: () => void;
}

export default function PetSelectionStep({
  onNext,
  onBack,
}: PetSelectionStepProps) {
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const data = await userApi.getMyPets();
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        toast.error("반려동물 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
  };

  const handleNext = () => {
    if (selectedPetId) {
      onNext(selectedPetId);
    }
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
          <span className="ml-3">반려동물 정보 로딩 중...</span>
        </div>
      </motion.div>
    );
  }

  if (pets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            등록된 반려동물이 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            서비스를 이용하기 위해 반려동물을 등록해주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              이전으로
            </button>
            <button
              onClick={() => (window.location.href = "/pets/register")}
              className="bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">반려동물 선택</h2>
        <p className="text-gray-600 mb-6">
          서비스를 받을 반려동물을 선택해주세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {pets.map((pet) => (
            <div
              key={pet.pet_id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPetId === pet.pet_id
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300"
              }`}
              onClick={() => handlePetSelect(pet.pet_id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 bg-gray-200 rounded-full"
                  style={{
                    backgroundImage: pet.image ? `url(${pet.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div>
                  <h3 className="font-medium text-lg">{pet.name}</h3>
                  <div className="text-gray-500 text-sm">
                    <p>{pet.breed || pet.species}</p>
                    <p>
                      {pet.age ? `${pet.age}세` : ""}{" "}
                      {pet.weight ? `${pet.weight}kg` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
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
