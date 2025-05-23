"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Business, ServiceWithBusiness } from "@/app/api/user/user";

interface BusinessSelectionStepProps {
  serviceBusinesses: ServiceWithBusiness[];
  isLoading: boolean;
  onNext: (businessId: string, businessName: string) => void;
}

export default function BusinessSelectionStep({
  serviceBusinesses,
  isLoading,
  onNext,
}: BusinessSelectionStepProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");

  const handleSelectBusiness = (serviceBusiness: ServiceWithBusiness) => {
    setSelectedBusinessId(serviceBusiness.business.id);
  };

  const handleNext = () => {
    const selectedServiceBusiness = serviceBusinesses.find(
      (sb) => sb.business.id === selectedBusinessId
    );
    if (selectedServiceBusiness) {
      onNext(
        selectedServiceBusiness.business.id,
        selectedServiceBusiness.business.name
      );
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-6">서비스 제공자 선택</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-lg h-24 animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (serviceBusinesses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-6">서비스 제공자 선택</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">
            이 서비스를 제공하는 사업자가 없습니다.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            뒤로 가기
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold mb-6">서비스 제공자 선택</h2>
      <div className="space-y-4">
        {serviceBusinesses.map((serviceBusiness, index) => {
          const business = serviceBusiness.business;

          return (
            <Card
              key={business.id || `business-${index}`}
              className={`cursor-pointer transition-colors ${
                selectedBusinessId === business.id
                  ? "border-2 border-violet-500"
                  : "border border-gray-200 hover:border-violet-300"
              }`}
              onClick={() => handleSelectBusiness(serviceBusiness)}
            >
              <CardContent className="flex items-start space-x-4 p-4">
                <div
                  className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"
                  style={{
                    backgroundImage: business.profile_image
                      ? `url(${business.profile_image})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{business.name}</h3>
                  <p className="text-sm text-violet-600 font-medium mt-1">
                    {serviceBusiness.service_name} -{" "}
                    {parseInt(serviceBusiness.price).toLocaleString()}원
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{business.address || "주소 정보 없음"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>{business.phone || "연락처 정보 없음"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedBusinessId}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          다음
        </Button>
      </div>
    </motion.div>
  );
}
