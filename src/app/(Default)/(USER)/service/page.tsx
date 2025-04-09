"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServicesHome() {
  return (
    <>
      <section className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          {services.map((service) => (
            <div
              key={service.href}
              className="relative w-full h-52 max-w-[400px] rounded-lg overflow-hidden shadow-lg group"
            >
              <Image
                src={service.src}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[102%]"
              />

              <div className="absolute bottom-5 left-5 z-20 text-white">
                <div className="flex flex-col mb-10">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <Link
                    href={service.href}
                    className={`flex items-center text-white rounded-md text-sm  transition`}
                  >
                    <span>자세히 보기</span>{" "}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-2 max-w-[110px] w-fit text-center">
                  <Link
                    href={`/reservation/${service.service_id}`}
                    className={`inline-block text-white px-4 py-1.5 rounded-md text-sm font-semibold transition ${service.buttonColor}`}
                  >
                    예약 하기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const services = [
  {
    name: "반려동물 화장 서비스",
    href: "/services/funeral.svg",
    src: "/services/funeral.svg",
    buttonColor: "bg-[#304F72]/70 hover:bg-[#304F72]",
    service_id: "7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  },
  {
    name: "반려동물 장례 서비스",
    href: "/service/funeral",
    src: "/services/cremation.svg",
    buttonColor: "bg-[#7C6E6C]/70 hover:bg-[#7C6E6C]",
    service_id: "9b851feb-d232-4117-a52a-5c0c5cc17ff4",
  },
  {
    name: "미용 서비스",
    href: "/service/grooming",
    src: "/services/bathing.svg",
    buttonColor: "bg-[#D08A58]/70 hover:bg-[#D08A58]",
    service_id: "0a1f07bd-5c19-4f68-8c3e-822449545cd6",
  },
  {
    name: "목욕 서비스",
    href: "/service/bathing",
    src: "/services/grooming.svg",
    buttonColor: "bg-[#F59B37] hover:bg-[#FE8B0C]",
    service_id: "3d4e5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s",
  },
  {
    name: "맞춤형 차량 제작",
    href: "/service/custom-vehicles",
    src: "/services/customCar.svg",
    buttonColor: "bg-[#201D3D] hover:bg-[#100D33]",
    service_id: "c2cb753f-1225-426e-9980-d700085dc719",
  },
  {
    name: "기타 반려동물 케어",
    href: "/service/other-care",
    src: "/services/other.svg",
    buttonColor: "bg-[#6CB55E] hover:bg-[#55A846]",
    service_id: "ececa9ba-3257-4338-87c5-4d3d03bd6bde",
  },
];
