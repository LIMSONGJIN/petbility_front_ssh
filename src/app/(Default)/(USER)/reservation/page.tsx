"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Star, Heart, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@/types/business";
import { ServiceCategory } from "@/types/api";
import { serviceApi } from "@/api/business";

const filterOptions = [
  { name: "가격 낮은 순", value: "price_asc" },
  { name: "가격 높은 순", value: "price_desc" },
  { name: "최신 순", value: "latest" },
];

export default function ReservationList() {
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("latest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await serviceApi.getServices();
      return response.data;
    },
  });

  // 🔹 필터 변경 시 서비스 리스트 정렬
  useEffect(() => {
    if (!services) return;

    let sortedServices = [...services];

    switch (selectedFilter) {
      case "price_asc":
        sortedServices.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedServices.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        sortedServices.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredServices(sortedServices);
  }, [selectedFilter, services]);

  // 🔹 필터 변경 함수
  const updateFilter = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 min-h-screen h-full flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-8 min-h-screen h-full">
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
            href={`/reservations/${service.service_id}`}
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
                  <span className="ml-1">{service.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
