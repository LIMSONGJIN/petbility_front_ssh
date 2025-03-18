"use client";

import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import Link from "next/link";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  return (
    <motion.div
      className="sign-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-center mb-4">비밀번호 초기화</h1>

      <ResetPasswordForm />

      <div className="flex flex-col items-center mt-4 gap-2 text-sm">
        <Link href="/auth/signin" className="text-violet-500 hover:underline">
          로그인 페이지로 이동
        </Link>
        <Link href="/auth" className="text-gray-500 hover:underline">
          홈으로 이동
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
