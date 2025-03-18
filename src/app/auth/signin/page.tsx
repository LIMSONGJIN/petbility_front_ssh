"use client";

import SignInForm from "@/components/Forms/SignInForm";
import { motion } from "framer-motion";

const SignInPage = () => {
  return (
    <motion.div
      className="sign-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold">로그인</h1>
      <SignInForm />
    </motion.div>
  );
};

export default SignInPage;
