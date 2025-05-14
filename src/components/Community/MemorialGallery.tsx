"use client";

import { useState } from "react";
import Link from "next/link";
import { memorials } from "@/data/service";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  Eye,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MemorialGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const postsPerPage = 12;

  const categories = ["전체", "강아지", "고양이", "기타"];

  // 검색 및 필터링 로직
  const filteredMemorials = memorials.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // 카테고리 필터링은 일단 비활성화 (데이터에 category 필드가 없음)
    return matchesSearch;
  });

  // 페이지네이션 로직
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredMemorials.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">추모 갤러리</h1>
          <p className="text-gray-600">
            소중한 반려동물과의 추억을 나누는 공간입니다.
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="추모 갤러리 검색"
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

        {/* 추모 갤러리 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <motion.div
              key={post.post_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <Link href={`/community/memorial-gallery/${post.post_id}`}>
                <div className="relative h-48">
                  {post.image_url && (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      기타
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>익명</span>
                      <span>{post.created_at}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        {post.comments_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-500" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {Array.from(
              { length: Math.ceil(filteredMemorials.length / postsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    currentPage === i + 1
                      ? "bg-violet-500 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
