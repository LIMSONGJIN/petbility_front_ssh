"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";

const services = [
  {
    service_id: "1",
    business_id: "biz-101",
    name: "반려동물 장례 서비스",
    description: "사랑하는 반려동물과의 마지막 순간을 존엄하게 보내세요.",
    price: 150000,
    duration: 120,
    available_time: "09:00 - 18:00",
    location: "서울 강남구",
    latitude: 37.4979,
    longitude: 127.0276,
    avg_rating: 4.8,
    review_count: 152,
    likes: 320,
    created_at: "2024-03-14T10:00:00Z",
  },
  {
    service_id: "2",
    business_id: "biz-102",
    name: "프리미엄 목욕 서비스",
    description: "반려동물의 피부 건강을 위한 전문가의 목욕 서비스.",
    price: 50000,
    duration: 60,
    available_time: "10:00 - 20:00",
    location: "서울 마포구",
    latitude: 37.5566,
    longitude: 126.9243,
    avg_rating: 4.5,
    review_count: 89,
    likes: 210,
    created_at: "2024-03-14T11:00:00Z",
  },
  {
    service_id: "3",
    business_id: "biz-103",
    name: "반려동물 미용 서비스",
    description: "전문가의 손길로 더욱 사랑스러운 반려동물 스타일링!",
    price: 70000,
    duration: 90,
    available_time: "11:00 - 19:00",
    location: "부산 해운대구",
    latitude: 35.1595,
    longitude: 129.1614,
    avg_rating: 4.7,
    review_count: 112,
    likes: 275,
    created_at: "2024-03-14T12:00:00Z",
  },
];

export default function ServiceList() {
  return (
    <section className="container mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        반려동물 서비스
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <motion.div
            key={service.service_id}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{service.description}</p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-violet-600">
                {service.price.toLocaleString()}원
              </span>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="text-yellow-400" size={16} />
                <span className="ml-1">
                  {service.avg_rating} ({service.review_count}개 리뷰)
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <MapPin size={16} className="mr-1" />
              {service.location}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link
                href={`/services/${service.service_id}`}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
              >
                상세 보기
              </Link>
              <div className="flex items-center text-gray-500">
                <Heart className="text-red-500" size={18} />
                <span className="ml-1">{service.likes}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
