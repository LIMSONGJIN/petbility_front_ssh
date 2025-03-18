"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center bg-gradient-to-r from-violet-200 to-purple-300 text-gray-900">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg" // 실제 이미지 경로 확인
          alt="반려동물과 함께하는 순간"
          fill
          className="opacity-40 object-cover"
        />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-tight text-gray-800"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          반려동물을 위한 <br /> 특별한 공간,{" "}
          <span className="text-violet-600">펫빌리티</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          함께하는 모든 순간을 소중하게.
          <br className="hidden md:block" /> 맞춤형 서비스로 반려동물과의 시간을
          더욱 특별하게 만들어보세요.
        </motion.p>
        <motion.div
          className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/reservations">
            <button className="px-6 py-3 bg-violet-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-violet-700 transition">
              서비스 예약하기
            </button>
          </Link>
          <Link href="/community">
            <button className="px-6 py-3 bg-white text-violet-600 border border-violet-600 text-lg font-semibold rounded-lg shadow-lg hover:bg-violet-100 transition">
              추모 공간 둘러보기
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
