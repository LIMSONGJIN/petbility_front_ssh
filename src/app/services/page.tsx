"use client";

import Link from "next/link";

export default function ServicesHome() {
  return (
    <section className="container mx-auto py-12 px-6 h-screen">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        펫빌리티 서비스 소개
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        펫빌리티는 반려동물과 보호자를 위한 다양한 맞춤형 서비스를 제공합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.href}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <Link
              href={service.href}
              className="text-violet-600 font-semibold hover:underline"
            >
              자세히 보기 →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

const services = [
  {
    name: "반려동물 장례 서비스",
    href: "/services/funeral",
    description:
      "Petbility의 반려동물 장례 서비스는 여러분의 소중한 가족 구성원을 위한 품격 있는 마지막 여정을 준비합니다.",
    description2:
      "전문가의 세심한 손길로 반려동물의 존엄성을 지키며 아름다운 이별을 도와드립니다.",
  },
  {
    name: "그루밍 서비스",
    href: "/services/grooming",
    description: "목욕과 미용을 결합한 프리미엄 반려동물 그루밍 서비스",
  },
  {
    name: "맞춤형 차량 제작",
    href: "/services/custom-vehicles",
    description: "반려동물 전용 차량을 맞춤 제작하는 서비스",
  },
  {
    name: "기타 반려동물 케어",
    href: "/services/other-care",
    description: "반려동물을 위한 다양한 맞춤형 관리 및 케어 서비스",
  },
];
