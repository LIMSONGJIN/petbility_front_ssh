"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pet, userApi } from "@/app/api/user/user";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

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

  const handleEdit = (petId: string) => {
    router.push(`/pets/${petId}/edit`);
  };

  const handleDelete = async (petId: string) => {
    if (!window.confirm("정말로 이 반려동물을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await userApi.deletePet(petId);
      toast.success("반려동물이 삭제되었습니다.");
      fetchPets(); // 목록 새로고침
    } catch (error) {
      console.error("Failed to delete pet:", error);
      toast.error("반려동물 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl mx-auto p-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="ml-3">반려동물 정보 로딩 중...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">내 반려동물</h1>
          <Button
            onClick={() => router.push("/pets/register")}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            반려동물 등록
          </Button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">등록된 반려동물이 없습니다.</p>
            <Button
              onClick={() => router.push("/pets/register")}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              반려동물 등록하기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.pet_id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="h-48 bg-gray-200"
                    style={{
                      backgroundImage: pet.image ? `url(${pet.image})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{pet.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pet.pet_id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(pet.pet_id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>종류: {pet.species}</p>
                      {pet.breed && <p>품종: {pet.breed}</p>}
                      {pet.age && <p>나이: {pet.age}세</p>}
                      {pet.weight && <p>체중: {pet.weight}kg</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
