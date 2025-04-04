import { useState } from "react";
import { motion } from "framer-motion";
import { mockReservationData } from "@/data/service";

interface AddressStepProps {
  onNext: () => void;
  onAddressChange: (address: string) => void;
}

export default function AddressStep({
  onNext,
  onAddressChange,
}: AddressStepProps) {
  const [isAddressCorrect, setIsAddressCorrect] = useState<boolean | null>(
    null
  );
  const [newAddress, setNewAddress] = useState("");
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  const handleAddressConfirm = (correct: boolean) => {
    setIsAddressCorrect(correct);
    if (correct) {
      onNext();
    } else {
      setShowNewAddressInput(true);
    }
  };

  const handleNewAddressSubmit = () => {
    if (newAddress.trim()) {
      onAddressChange(newAddress);
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">주소 확인</h2>
        <p className="text-gray-600 mb-6">
          아래 주소가 서비스 제공 지역이 맞는지 확인해주세요.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-lg font-medium">
            {mockReservationData.userAddress.address}
          </p>
        </div>

        {!showNewAddressInput ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleAddressConfirm(true)}
              className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
            >
              주소가 맞습니다
            </button>
            <button
              onClick={() => handleAddressConfirm(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              주소가 다릅니다
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="새로운 주소를 입력해주세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleNewAddressSubmit}
              className="w-full bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
            >
              주소 변경 및 다음
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
