import { LoginForm } from "@/components/Forms/SignInForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "로그인 | 마케팅 최적화 서비스",
  description: "소셜 로그인으로 간편하게 로그인하세요.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">
            소셜 계정으로 간편하게 로그인하세요
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
