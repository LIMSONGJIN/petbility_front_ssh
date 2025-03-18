"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Image as ImageIcon, MessageSquare } from "lucide-react";

const memorialItems = [
  {
    icon: <Users size={40} className="text-violet-600 mb-4" />,
    title: "메타버스 추모 공간",
    description: "가상 공간에서 반려동물을 기릴 수 있는 특별한 공간입니다.",
    href: "/community/metaverse",
  },
  {
    icon: <ImageIcon size={40} className="text-violet-600 mb-4" />,
    title: "온라인 추모 갤러리",
    description: "반려동물의 사진과 추억을 공유하는 갤러리입니다.",
    href: "/community/memorial-gallery",
  },
  {
    icon: <MessageSquare size={40} className="text-violet-600 mb-4" />,
    title: "커뮤니티 포럼",
    description: "보호자들과 소통하며 위로를 나눌 수 있는 커뮤니티입니다.",
    href: "/community/forum",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 자식 요소들이 순차적으로 등장
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function MemorialSection() {
  return (
    <section className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
        추모 공간
      </h2>
      <p className="text-center text-gray-600 mb-8">
        소중한 반려동물의 기억을 함께 나누는 공간입니다.
      </p>

      {/* 3가지 카테고리 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {memorialItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center hover:shadow-xl"
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }} // ✅ 더 부드러운 호버 효과
          >
            {item.icon}
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 text-violet-600 font-semibold hover:underline"
            >
              방문하기 →
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
