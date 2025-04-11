"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Service, serviceApi } from "@/api/service";
import { toast } from "sonner";
import { ServiceCategory } from "@/types/api";

// 서비스 카테고리별 이미지 및 스타일 매핑
const serviceStyles = {
  [ServiceCategory.FUNERAL]: {
    src: "/services/cremation.svg",
    buttonColor: "bg-[#7C6E6C]/70 hover:bg-[#7C6E6C]",
  },
  [ServiceCategory.CREMATION]: {
    src: "/services/funeral.svg",
    buttonColor: "bg-[#304F72]/70 hover:bg-[#304F72]",
  },
  [ServiceCategory.BATHING]: {
    src: "/services/grooming.svg",
    buttonColor: "bg-[#F59B37] hover:bg-[#FE8B0C]",
  },
  [ServiceCategory.GROOMING]: {
    src: "/services/bathing.svg",
    buttonColor: "bg-[#D08A58]/70 hover:bg-[#D08A58]",
  },
  [ServiceCategory.CUSTOM_VEHICLES]: {
    src: "/services/customCar.svg",
    buttonColor: "bg-[#201D3D] hover:bg-[#100D33]",
  },
  [ServiceCategory.OTHER_CARE]: {
    src: "/services/other.svg",
    buttonColor: "bg-[#6CB55E] hover:bg-[#55A846]",
  },
};

// 서비스 카테고리별 경로 매핑
const categoryRoutes = {
  [ServiceCategory.CREMATION]: "/service/cremation",
  [ServiceCategory.FUNERAL]: "/service/funeral",
  [ServiceCategory.GROOMING]: "/service/grooming",
  [ServiceCategory.BATHING]: "/service/bathing",
  [ServiceCategory.CUSTOM_VEHICLES]: "/service/custom_vehicles",
  [ServiceCategory.OTHER_CARE]: "/service/other_care",
};

export default function ServicesHome() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const servicesData = await serviceApi.getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error("서비스 목록을 가져오는데 실패했습니다:", error);
        toast.error("서비스 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  // 로딩 중일 때 표시할 스켈레톤 UI
  if (loading) {
    return (
      <section className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="relative w-full h-52 max-w-[400px] rounded-lg overflow-hidden bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // 서비스가 없을 때 표시할 메시지
  if (services.length === 0) {
    return (
      <section className="container mx-auto py-12 px-6 text-center">
        <p className="text-gray-500">등록된 서비스가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {services.map((service) => {
          const category = service.category as ServiceCategory;
          const style = serviceStyles[category] || {
            src: "/services/other.svg",
            buttonColor: "bg-gray-500 hover:bg-gray-600",
          };
          const href = categoryRoutes[category] || "/service";

          return (
            <div
              key={service.service_id}
              className="relative w-full h-52 max-w-[400px] rounded-lg overflow-hidden shadow-lg group"
            >
              <Image
                src={service.image || style.src}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[102%]"
              />

              <div className="absolute bottom-5 left-5 z-20 text-white">
                <div className="flex flex-col mb-10">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <Link
                    href={`${href}`}
                    className="flex items-center text-white rounded-md text-sm transition"
                  >
                    <span>자세히 보기</span>{" "}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-2 max-w-[110px] w-fit text-center">
                  <Link
                    href={`/reservation/${service.service_id}`}
                    className={`inline-block text-white px-4 py-1.5 rounded-md text-sm font-semibold transition ${style.buttonColor}`}
                  >
                    예약 하기
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
