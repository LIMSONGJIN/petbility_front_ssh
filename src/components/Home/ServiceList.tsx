"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Flower2,
  Flame,
  Scissors,
  ShowerHead,
} from "lucide-react";
import { ServiceCategory } from "@/types/api";
import { services } from "@/data/service";

const serviceCategories = [
  {
    id: ServiceCategory.FUNERAL,
    name: "장례 서비스",
    description: "반려동물의 마지막을 존엄하게 보내는 맞춤형 장례 서비스",
    icon: <Flower2 className="w-12 h-12 text-violet-600" />,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    id: ServiceCategory.CREMATION,
    name: "화장 서비스",
    description: "반려동물의 마지막을 정중하게 보내는 전문 화장 서비스",
    icon: <Flame className="w-12 h-12 text-orange-500" />,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    id: ServiceCategory.GROOMING,
    name: "미용 서비스",
    description: "반려동물의 건강과 스타일을 책임지는 종합적인 미용 서비스",
    icon: <Scissors className="w-12 h-12 text-blue-500" />,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: ServiceCategory.BATHING,
    name: "목욕 서비스",
    description: "반려동물의 건강과 위생을 위한 전문 목욕 서비스",
    icon: <ShowerHead className="w-12 h-12 text-cyan-500" />,
    gradient: "from-cyan-500 to-cyan-600",
  },
];

export default function ServiceList() {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2 font-hakgyo">
        서비스
      </h2>
      <p className="text-center text-gray-600 mb-8">
        소중한 반려동물의 서비스를 소개합니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {serviceCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/service/${category.id}`}
              className="group block h-full"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                <div className="p-6 flex-1">
                  <div className="mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-violet-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-violet-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      자세히 보기
                    </span>
                    <ArrowRight className="w-4 h-4 text-violet-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">평균 가격</span>
                    <span className="font-semibold text-gray-800">
                      {services
                        .filter((s) => s.category === category.id)
                        .reduce((acc, curr) => acc + curr.price, 0) /
                        services.filter((s) => s.category === category.id)
                          .length}
                      원
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
