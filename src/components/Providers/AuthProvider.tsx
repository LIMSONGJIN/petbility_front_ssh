"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/api";
import { createClient } from "@/utils/supabase/client";

// 보호된 경로 정의
const PROTECTED_ROUTES = ["/admin", "/business", "/profile"];
const ADMIN_ROUTES = ["/admin"];
const BUSINESS_ROUTES = ["/business"];

// 통합된 AuthProvider 컴포넌트 (SessionProvider 기능 포함)
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    initializeAuth,
    accessToken,
    session,
  } = useAuthStore();
  const { user, isLoading: isUserLoading, refetch: refetchUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const isRedirecting = useRef(false);
  const isSyncingUser = useRef(false);

  // 컴포넌트 마운트 시 인증 초기화
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("AuthProvider: 인증 초기화 시작");
        // 인증 초기화만 수행 (fetchSession은 내부에서 호출됨)
        await initializeAuth();
        console.log("AuthProvider: 인증 초기화 완료");
        setIsInitialized(true);
      } catch (error) {
        console.error("AuthProvider: 인증 초기화 오류", error);
        setIsInitialized(true); // 오류가 있어도 초기화는 완료된 것으로 처리
      }
    };

    initialize();
  }, [initializeAuth]);

  // 로컬 스토리지에서 역할 가져오기
  const getUserRoleFromStorage = (): UserRole | null => {
    if (typeof window === "undefined") return null;

    const role = localStorage.getItem("userRole") as UserRole | null;
    console.log("AuthProvider: 로컬 스토리지 역할 확인", role);
    return role;
  };

  // 세션 동기화 및 사용자 정보 처리
  useEffect(() => {
    const syncUserData = async () => {
      if (!isInitialized || isSyncingUser.current) return;

      isSyncingUser.current = true;
      console.log("AuthProvider: 사용자 데이터 동기화 시작");

      try {
        // 세션이 있지만 사용자 정보가 없는 경우 사용자 정보 조회
        if (session?.user && (!user || isUserLoading)) {
          console.log("AuthProvider: 세션 있음, 사용자 정보 조회");
          await refetchUser();
        }

        // 역할 정보 동기화
        if (user?.role) {
          // 로컬 스토리지에 저장된 역할과 API 응답의 역할이 다른 경우
          const storedRole = localStorage.getItem("userRole");
          console.log("AuthProvider: 역할 동기화 확인", {
            apiRole: user.role,
            storedRole: storedRole || "undefined",
          });

          if (!storedRole || storedRole !== user.role) {
            console.log("AuthProvider: 역할 정보 업데이트", user.role);
            localStorage.setItem("userRole", user.role);

            // Supabase 사용자 메타데이터 업데이트 (역할 동기화)
            if (session?.user) {
              const supabase = createClient();
              await supabase.auth.updateUser({
                data: {
                  role: user.role,
                  email: user.email,
                  name: user.name,
                  phone: user.phone,
                  profileImage: user.profile_image,
                },
              });
            }
          }
        }
      } catch (error) {
        console.error("AuthProvider: 사용자 동기화 중 오류 발생", error);
      } finally {
        isSyncingUser.current = false;
        console.log("AuthProvider: 사용자 데이터 동기화 완료");
      }
    };

    if (isInitialized && isAuthenticated) {
      syncUserData();
    }
  }, [
    isInitialized,
    isAuthenticated,
    user,
    session,
    refetchUser,
    isUserLoading,
  ]);

  // 경로가 보호되어 있는지 확인
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 인증 상태에 따른 라우팅 처리
  useEffect(() => {
    // 초기화 또는 로딩 중이면 아무 작업도 하지 않음
    if (!isInitialized || isAuthLoading) {
      return;
    }

    // 이미 리다이렉트 중이면 중복 처리 방지
    if (isRedirecting.current) {
      return;
    }

    // 인증이 필요한 경로에 인증 없이 접근하는 경우
    if (isProtectedRoute && !isAuthenticated) {
      console.log("AuthProvider: 인증 필요 경로에 비인증 접근", pathname);
      isRedirecting.current = true;
      router.push(`/auth/signin?redirectTo=${pathname}`);
      return;
    }

    // 로컬 스토리지에서 역할 정보 확인 (API 응답 대기 없이 빠른 검사)
    const storedRole = getUserRoleFromStorage();

    // 인증된 사용자의 역할 기반 접근 제어
    if (isAuthenticated) {
      // 사용자 객체 또는 로컬 스토리지 역할 사용
      const effectiveRole = user?.role || storedRole;
      console.log("AuthProvider: 역할 기반 접근 제어", {
        pathname,
        effectiveRole,
        userRole: user?.role,
        storedRole,
      });

      // 홈 경로(/)에 비즈니스 계정이 접근한 경우 비즈니스 대시보드로 리다이렉트
      if (pathname === "/" && effectiveRole === UserRole.BUSINESS) {
        console.log(
          "AuthProvider: 비즈니스 계정이 홈 접근, 비즈니스 대시보드로 리다이렉트"
        );
        isRedirecting.current = true;
        router.push("/business");
        return;
      }

      // 홈 경로(/)에 관리자 계정이 접근한 경우 관리자 대시보드로 리다이렉트
      if (pathname === "/" && effectiveRole === UserRole.ADMIN) {
        console.log(
          "AuthProvider: 관리자 계정이 홈 접근, 관리자 대시보드로 리다이렉트"
        );
        isRedirecting.current = true;
        router.push("/admin");
        return;
      }

      // 관리자 경로에 관리자가 아닌 사용자가 접근하는 경우
      if (
        ADMIN_ROUTES.some((route) => pathname.startsWith(route)) &&
        effectiveRole !== UserRole.ADMIN
      ) {
        console.log(
          "AuthProvider: 관리자 아닌 사용자가 관리자 경로 접근",
          pathname
        );
        isRedirecting.current = true;
        router.push(effectiveRole === UserRole.BUSINESS ? "/business" : "/");
        return;
      }

      // 비즈니스 경로에 비즈니스 계정이 아닌 사용자가 접근하는 경우
      if (
        BUSINESS_ROUTES.some((route) => pathname.startsWith(route)) &&
        effectiveRole !== UserRole.ADMIN &&
        effectiveRole !== UserRole.BUSINESS
      ) {
        console.log(
          "AuthProvider: 비즈니스 아닌 사용자가 비즈니스 경로 접근",
          pathname
        );
        isRedirecting.current = true;
        router.push("/");
        return;
      }
    }

    // 리다이렉트 플래그 초기화
    isRedirecting.current = false;
  }, [isInitialized, isAuthLoading, isAuthenticated, user, pathname, router]);

  // 로딩 중이고 보호된 경로인 경우 로딩 표시
  if ((isAuthLoading || !isInitialized) && isProtectedRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-violet-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
