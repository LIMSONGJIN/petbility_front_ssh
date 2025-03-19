"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MetaverseRoom() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 overflow-hidden">
      {/* 배경 (방 안 느낌) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(20,20,20,1)_0%,_rgba(5,5,5,1)_100%)]"></div>

      {/* 바닥 그림자 */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent"></div>

      {/* 중앙 실루엣 */}
      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* 반려동물 실루엣 */}
        <motion.div
          className="w-40 h-40 md:w-60 md:h-60 bg-gray-700/50 rounded-full flex items-center justify-center shadow-xl"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        >
          <Image
            src="/metaverse.png"
            alt="반려동물 실루엣"
            width={300}
            height={300}
            className="opacity-80"
          />
        </motion.div>

        {/* 감성적인 텍스트 */}
        <motion.p
          className="mt-6 text-lg text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          "여기서 다시 만날 수 있어요..."
        </motion.p>
      </motion.div>
    </section>
  );
}
