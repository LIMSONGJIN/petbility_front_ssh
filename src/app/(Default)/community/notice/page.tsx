"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Filter, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 임시 공지사항 데이터
const mockNotices = [
  {
    id: "1",
    title: "서비스 이용 안내",
    content: "새로운 서비스 이용 방법에 대한 안내입니다.",
    date: "2024-03-15",
    author: "관리자",
    views: 120,
    isImportant: true,
    category: "공지",
  },
  {
    id: "2",
    title: "시스템 점검 안내",
    content: "3월 20일 시스템 점검 예정입니다.",
    date: "2024-03-14",
    author: "관리자",
    views: 85,
    isImportant: true,
    category: "점검",
  },
  {
    id: "3",
    title: "이벤트 안내",
    content: "봄맞이 이벤트가 시작됩니다.",
    date: "2024-03-13",
    author: "관리자",
    views: 210,
    isImportant: false,
    category: "이벤트",
  },
  {
    id: "4",
    title: "서비스 업데이트",
    content: "새로운 기능이 추가되었습니다.",
    date: "2024-03-12",
    author: "관리자",
    views: 95,
    isImportant: false,
    category: "업데이트",
  },
];

export default function NoticePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ["전체", "공지", "점검", "이벤트", "업데이트"];

  const filteredNotices = mockNotices.filter((notice) => {
    const matchesSearch = notice.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">공지사항</h1>
          <p className="text-gray-600">
            Petbility의 최신 소식과 중요한 공지를 확인하세요.
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="공지사항 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      selectedCategory === category
                        ? "text-violet-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/community/notice/${notice.id}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.isImportant && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                            중요
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {notice.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {notice.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{notice.author}</span>
                        <span>{notice.date}</span>
                        <span>조회수 {notice.views}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
