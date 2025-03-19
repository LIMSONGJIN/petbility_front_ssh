"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-6 py-12">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900 opacity-90"></div>

      {/* 페이지 컨텐츠 */}
      <div className="relative z-10 text-center max-w-2xl">
        <motion.h1
          className="text-4xl md:text-5xl font-serif font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          추모 공간
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          사랑하는 반려동물을 기억하고, 그들의 따뜻한 추억을 공유하는
          공간입니다. 메타버스에서 다시 만날 수 있도록 조용한 마음으로
          함께해주세요.
        </motion.p>

        {/* 메타버스 공간 이동 버튼 */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Link
            href="/community/metaverse"
            className="px-6 py-3 text-lg font-medium text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg shadow-md transition hover:bg-gray-700/80 hover:scale-105"
          >
            메타버스 공간으로 이동하기 →
          </Link>

          <Link
            href="/community/memorial-gallery"
            className="px-6 py-3 text-lg font-medium text-gray-100 bg-gray-700 border border-gray-500 rounded-lg shadow-md transition hover:bg-gray-600 hover:scale-105"
          >
            온라인 추모 갤러리 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
