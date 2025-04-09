"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/types/api";

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
    if (!isInitialized || isAuthLoading || isUserLoading) return;

    // 공개 페이지 목록 (인증 없이 접근 가능)
    const publicPaths = [
      "/auth/signin",
      "/auth/signup",
      "/auth/reset",
      "/auth/confirm",
      "/auth/callback",
      "/",
      "/about",
      "/contact",
      "/services",
      "/products",
      "/community",
    ];

    // 현재 경로가 공개 페이지인지 확인
    const isPublicPath = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // 인증되지 않았고 공개 페이지가 아닌 경우에만 로그인 페이지로 리다이렉트
    if (!isAuthenticated && !isPublicPath) {
      router.replace("/auth/signin");
      return;
    }

    // 인증되었고 사용자 정보가 있는 경우 역할에 따른 라우팅
    if (isAuthenticated && user) {
      switch (user.role) {
        case UserRole.ADMIN:
          // 어드민은 /admin 경로와 공개 경로에 접근 가능
          if (
            !pathname.startsWith("/admin") &&
            !isPublicPath &&
            pathname !== "/"
          ) {
            router.replace("/admin");
          }
          break;
        case UserRole.BUSINESS:
          // 비즈니스 사용자는 /business 경로와 공개 경로에 접근 가능
          if (
            !pathname.startsWith("/business") &&
            !isPublicPath &&
            pathname !== "/"
          ) {
            router.replace("/business");
          }
          break;
        case UserRole.USER:
          // 일반 사용자는 /admin과 /business 경로에 접근 불가
          if (
            pathname.startsWith("/admin") ||
            pathname.startsWith("/business")
          ) {
            router.replace("/");
          }
          break;
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
