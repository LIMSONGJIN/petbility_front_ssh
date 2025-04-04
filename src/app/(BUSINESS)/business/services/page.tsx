"use client";

import { useEffect, useState } from "react";
import { Service } from "@/types/business";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/constants/service";
import { ServiceCard } from "@/components/Business/Service/ServiceCard";
import { serviceApi } from "@/api/business";
import { toast } from "react-toastify";

export default function BusinessServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadServices = async () => {
    try {
      const response = await serviceApi.getServices();
      setServices(response.data);
    } catch (error) {
      console.error("서비스 목록 조회 실패:", error);
      toast.error("서비스 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleServiceToggle = async (
    serviceId: string,
    currentStatus: Service["status"]
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await serviceApi.updateServiceStatus(serviceId, newStatus);

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.service_id === serviceId
            ? { ...service, status: newStatus }
            : service
        )
      );

      toast.success(
        newStatus === "active"
          ? "서비스 운영이 시작되었습니다."
          : "서비스 운영이 중지되었습니다."
      );
    } catch (error) {
      console.error("서비스 상태 변경 실패:", error);
      toast.error("서비스 상태를 변경하는데 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-6">로딩 중...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">운영 서비스 관리</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((category) => {
          const service = services.find((s) => s.name === category.name);
          const isActive = service?.status === "active";

          return (
            <ServiceCard
              key={category.id}
              category={category}
              isActive={isActive}
              onToggle={() =>
                service &&
                handleServiceToggle(service.service_id, service.status)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
