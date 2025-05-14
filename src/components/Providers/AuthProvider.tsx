"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/types/api";

// 보호된 경로 (인증 필요)
const protectedPaths = ["/admin", "/business"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    initializeAuth,
  } = useAuthStore();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 인증 상태 설정
  useEffect(() => {
    const init = async () => {
      await initializeAuth();

      setIsInitialized(true);
    };

    init();
  }, [initializeAuth]);

  // 인증 상태에 따른 라우팅 처리
  useEffect(() => {
    // 초기화가 완료되지 않았으면 아무것도 하지 않음
    if (!isInitialized || isAuthLoading || isUserLoading) {
      return;
    }

    // 현재 경로가 보호된 경로인지 확인
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // 보호된 경로가 아니면 아무런 제한 없이 접근 가능
    if (!isProtectedPath) {
      return;
    }

    // 인증되지 않았고 보호된 경로인 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push(`/auth/signin?redirectTo=${pathname}`);
      return;
    }

    // 인증되었고 사용자 정보가 있는 경우 역할에 따른 라우팅
    if (isAuthenticated && user) {
      console.log("AuthProvider: 사용자 역할:", user.role);

      if (pathname.startsWith("/admin") && user.role !== UserRole.ADMIN) {
        router.push(user.role === UserRole.BUSINESS ? "/business" : "/");
        return;
      }

      if (
        pathname.startsWith("/business") &&
        user.role !== UserRole.ADMIN &&
        user.role !== UserRole.BUSINESS
      ) {
        router.push("/");
        return;
      }
    }
  }, [
    isAuthenticated,
    isAuthLoading,
    isUserLoading,
    user,
    pathname,
    router,
    isInitialized,
  ]);

  // 로딩 중이면 로딩 표시
  if (isAuthLoading || isUserLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
