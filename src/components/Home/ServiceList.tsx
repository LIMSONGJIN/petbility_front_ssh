"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { services } from "@/data/service";

export default function ServiceList() {
  return (
    <section className="container mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
        반려동물 서비스
      </h2>
      <p className="text-center text-gray-600 mb-8">
        소중한 반려동물을 위한 특별한 서비스입니다.
      </p>

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
                href={`/reservations/${service.service_id}`}
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
