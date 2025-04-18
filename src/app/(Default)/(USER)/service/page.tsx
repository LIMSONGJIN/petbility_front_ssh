"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Service, serviceApi } from "@/api/service";
import { toast } from "sonner";
import { ServiceCategory } from "@/types/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    speed: 500,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

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
        <div className="flex gap-4 justify-center">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="relative w-[300px] h-[400px] rounded-lg overflow-hidden bg-gray-200 animate-pulse"
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
      <style jsx global>{`
        .slick-slide {
          transition: all 0.3s ease;
          transform: scale(0.85);
          opacity: 0.5;
        }
        .slick-center {
          transform: scale(1);
          opacity: 1;
        }
        .slick-slide > div {
          margin: 0 15px;
        }
        .slick-list {
          margin: 0 -15px;
        }
        .slick-dots {
          bottom: -40px;
        }
        .slick-dots li button:before {
          font-size: 12px;
        }
        .slick-prev,
        .slick-next {
          z-index: 1;
          width: 40px;
          height: 40px;
        }
        .slick-prev {
          left: 25px;
        }
        .slick-next {
          right: 25px;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto">
        <Slider {...sliderSettings}>
          {services.map((service) => {
            const category = service.category as ServiceCategory;
            const style = serviceStyles[category] || {
              src: "/services/other.svg",
              buttonColor: "bg-gray-500 hover:bg-gray-600",
            };
            const href = categoryRoutes[category] || "/service";

            return (
              <div key={service.service_id}>
                <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={service.image || style.src}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[102%]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-2xl font-bold mb-3">
                        {service.name}
                      </h3>
                      <p className="text-sm text-white/80 mb-6 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex gap-3">
                        <Link
                          href={`/reservation/${service.service_id}`}
                          className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold transition ${style.buttonColor}`}
                        >
                          예약하기
                        </Link>
                        <Link
                          href={href}
                          className="flex-1 flex items-center justify-center gap-1 border border-white/30 text-white rounded-full hover:bg-white/10 transition"
                        >
                          자세히 보기 <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}
