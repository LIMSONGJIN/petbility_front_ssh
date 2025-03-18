"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Star, Heart, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/service";

const filterOptions = [
  { name: "가까운 순", value: "distance" },
  { name: "별점 순", value: "rating" },
  { name: "리뷰 순", value: "reviews" },
  { name: "좋아요 순", value: "likes" },
];

export default function ReservationList() {
  const [filteredServices, setFilteredServices] = useState(services);
  const [selectedFilter, setSelectedFilter] = useState("rating"); // ✅ useState로 필터 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔹 필터 변경 시 서비스 리스트 정렬
  useEffect(() => {
    let sortedServices = [...services];

    if (selectedFilter === "rating") {
      sortedServices.sort((a, b) => b.avg_rating - a.avg_rating);
    } else if (selectedFilter === "reviews") {
      sortedServices.sort((a, b) => b.review_count - a.review_count);
    } else if (selectedFilter === "likes") {
      sortedServices.sort((a, b) => b.likes - a.likes);
    }

    setFilteredServices(sortedServices);
  }, [selectedFilter]);

  // 🔹 필터 변경 함수
  const updateFilter = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  // 🔹 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <section className="container mx-auto px-6 py-8 h-screen">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        모든 서비스 예약
      </h2>

      {/* 🔹 필터 드롭다운 */}
      <div className="relative flex justify-end mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 bg-white text-gray-700 rounded-md flex items-center transition-all hover:bg-gray-300"
        >
          <Filter size={18} className="mr-2" />
          {filterOptions.find((f) => f.value === selectedFilter)?.name}
        </button>

        {/* 🔹 드롭다운 애니메이션 적용 */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 mt-10 w-[122px] bg-white shadow-lg rounded-md border border-gray-200 z-50"
            >
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => updateFilter(option.value)}
                  className={`cursor-pointer px-4 py-2 text-gray-800 transition-all ${
                    selectedFilter === option.value
                      ? "bg-violet-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {option.name}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔹 서비스 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Link
            key={service.service_id}
            href={`/reservations/detail/${service.service_id}`}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-800">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {service.description}
              </p>
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
                <MapPin size={16} className="mr-1" /> {service.location}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-gray-500">
                  <Heart className="text-red-500" size={18} />
                  <span className="ml-1">{service.likes}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
