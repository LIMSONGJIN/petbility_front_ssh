"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/constants/service";
import { ServiceCard } from "@/components/Business/Service/ServiceCard";
import { toast } from "sonner";
import { Service, serviceApi } from "@/api/service";
import { businessServiceApi } from "@/api/business/business";
import { ServiceCategory } from "@/types/api";

// 카테고리 ID 매핑 (API 응답의 category 값과 SERVICE_CATEGORIES의 id 값 매핑)
const CATEGORY_MAPPING: Record<string, string> = {
  funeral: "funeral",
  cremation: "cremation",
  grooming: "grooming",
  bathing: "bathing",
  other_care: "other-care",
};

export default function BusinessServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null
  );

  // 서비스 목록 로드
  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // API를 사용하여 서비스 목록 가져오기
      const servicesData = await serviceApi.getAllServices();
      console.log("서비스 목록:", servicesData);
      setServices(servicesData);
    } catch (error) {
      console.error("서비스 목록 조회 실패:", error);
      setError("서비스 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      toast.error("서비스 목록을 불러오는데 실패했습니다.");
      setServices([]); // 에러 시 빈 배열 설정
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // 서비스 활성화/비활성화 토글
  const handleServiceToggle = async (
    serviceId: string,
    currentStatus: Service["status"]
  ) => {
    try {
      setUpdatingServiceId(serviceId);
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      console.log("서비스 상태 변경 요청:", {
        serviceId,
        newStatus,
      });

      // 새로운 API를 사용하여 서비스 상태 업데이트
      await businessServiceApi.updateServiceStatus(serviceId, newStatus);

      // 로컬 상태 업데이트
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
      loadServices(); // 실패 시 목록 새로고침
    } finally {
      setUpdatingServiceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadServices}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">운영 서비스 관리</h1>
        <Button onClick={loadServices} variant="outline" size="sm">
          새로고침
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">등록된 서비스가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.map((category) => {
            // API 카테고리와 UI 카테고리 매핑
            const service = services.find((s) => {
              const mappedCategory = CATEGORY_MAPPING[s.category] || s.category;
              return mappedCategory === category.id;
            });
            const isActive = service?.status === "active";

            return (
              <ServiceCard
                key={category.id}
                category={category}
                isActive={isActive}
                serviceId={service?.service_id}
                onToggle={() =>
                  service &&
                  !(updatingServiceId === service.service_id) &&
                  handleServiceToggle(
                    service.service_id,
                    service.status || "inactive"
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
