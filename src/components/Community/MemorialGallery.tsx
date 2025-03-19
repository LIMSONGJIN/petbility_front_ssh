"use client";

import { useState } from "react";
import Link from "next/link";
import { memorials } from "@/data/service";
import Image from "next/image";
import { Heart, MessageSquare, Eye } from "lucide-react";

export default function MemorialGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // 페이지네이션 로직
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = memorials.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <section className="container mx-auto py-12 px-6">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
        🕊 온라인 추모 갤러리
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <Link
            key={post.post_id}
            href={`/community/memorial-gallery/${post.post_id}`}
          >
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition hover:scale-105">
              {post.image_url && (
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  width={500}
                  height={300}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className=" line-clamp-1 font-semibold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm line-clamp-1">
                  {post.content.substring(0, 50)}...
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <span className="flex items-center gap-1">
                    <Heart size={16} className="text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={16} className="text-blue-500" />{" "}
                    {post.comments_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={16} className="text-gray-500" /> {post.views}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 UI */}
      <div className="flex justify-center mt-8">
        {Array.from(
          { length: Math.ceil(memorials.length / postsPerPage) },
          (_, i) => (
            <button
              key={i}
              className={`flex justify-center items-center px-2 mx-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-violet-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </section>
  );
}
