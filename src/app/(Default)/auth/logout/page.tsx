"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await signOut({ redirect: false });
      router.push("/");
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold">로그아웃 중...</h1>
        <p className="mt-2 text-gray-600">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
