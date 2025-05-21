"use client";

import SignInForm from "@/components/Forms/SignInForm";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SignInPage = () => {
  const { isAuthenticated, session } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, session, router, redirectTo]);

  return (
    <motion.div
      className="sign-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold">로그인</h1>
      <SignInForm redirectTo={redirectTo} />
    </motion.div>
  );
};

export default SignInPage;
