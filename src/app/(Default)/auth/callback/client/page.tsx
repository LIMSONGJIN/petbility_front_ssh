"use client";

// InitUserSync 대신 AuthProvider에서 인증 처리
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@/types/api";
import { createClient } from "@/utils/supabase/client";

export default function OAuthCallbackClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { initializeAuth, session, isLoading } = useAuthStore();
  const { user, isLoading: isUserLoading, refetch: refetchUser } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectAttempts = useRef(0);

  // 인증 초기화
  useEffect(() => {
    const syncAuth = async () => {
      try {
        console.log("콜백: 인증 초기화 시작");
        await initializeAuth();
        console.log("콜백: 인증 초기화 완료");
        setIsInitializing(false);
      } catch (error) {
        console.error("콜백: 인증 초기화 오류", error);
        setIsInitializing(false);
      }
    };

    syncAuth();
  }, [initializeAuth]);

  // 사용자 정보 동기화
  useEffect(() => {
    // 초기화 중이거나 리다이렉트 중이면 건너뜀
    if (isInitializing || isRedirecting) return;

    // 세션이 있고 사용자 정보가 없거나 로딩 중일 때 사용자 정보 조회
    if (session?.user && (!user || isUserLoading)) {
      console.log("콜백: 사용자 정보 조회 시작");
      refetchUser();
    }
  }, [
    isInitializing,
    isRedirecting,
    session,
    user,
    isUserLoading,
    refetchUser,
  ]);

  // 역할 정보 수동 확인
  const getUserRoleFromStorage = () => {
    return localStorage.getItem("userRole") as UserRole | null;
  };

  // 리다이렉션 처리
  useEffect(() => {
    // 이미 리다이렉트 중이거나, 초기화 중이거나, 인증 로딩 중이면 아직 처리하지 않음
    if (isRedirecting || isInitializing || isLoading) return;

    // 최대 3회까지만 시도 (무한 루프 방지)
    if (redirectAttempts.current >= 3) {
      console.warn("콜백: 최대 리다이렉트 시도 횟수 초과");
      router.push("/");
      return;
    }

    const handleRedirect = async () => {
      try {
        redirectAttempts.current += 1;
        setIsRedirecting(true);
        console.log("콜백: 리다이렉트 처리 시작", redirectAttempts.current);

        // 세션이 있으면 사용자 정보 확인
        if (session?.user) {
          // 사용자 정보가 있으면 역할 확인
          if (user?.role) {
            console.log("콜백: 사용자 역할 확인 (API)", user.role);

            // 역할 정보 로컬 스토리지에 저장 (중요: 업데이트 강제)
            localStorage.setItem("userRole", user.role);

            // 사용자 메타데이터 업데이트 (역할 동기화)
            const supabase = createClient();
            await supabase.auth.updateUser({
              data: {
                role: user.role,
              },
            });

            // 역할에 따른 리다이렉트
            if (redirectTo && redirectTo !== "/") {
              console.log("콜백: 지정된 경로로 리다이렉트", redirectTo);
              router.push(redirectTo);
            } else {
              // 역할에 따른 리다이렉트
              switch (user.role) {
                case UserRole.ADMIN:
                  console.log("콜백: 관리자 대시보드로 리다이렉트");
                  router.push("/admin");
                  break;
                case UserRole.BUSINESS:
                  console.log("콜백: 비즈니스 대시보드로 리다이렉트");
                  router.push("/business");
                  break;
                default:
                  console.log("콜백: 기본 페이지로 리다이렉트");
                  router.push("/");
              }
            }
          } else {
            // API에서 역할 정보를 가져오지 못했지만 로컬 스토리지에 있는 경우
            const storedRole = getUserRoleFromStorage();
            console.log("콜백: 로컬 스토리지에서 역할 확인", storedRole);

            if (storedRole) {
              // 로컬 스토리지 역할 기반 리다이렉트
              switch (storedRole) {
                case UserRole.ADMIN:
                  router.push("/admin");
                  break;
                case UserRole.BUSINESS:
                  router.push("/business");
                  break;
                default:
                  router.push("/");
              }
            } else {
              // 역할 정보가 없어 홈으로 리다이렉트
              console.log("콜백: 역할 정보 없음, 홈으로 리다이렉트");
              router.push("/");

              // 역할 정보 동기화 재시도
              await refetchUser();
            }
          }
        } else {
          // 세션이 없으면 로그인 페이지로 이동
          console.log("콜백: 세션 없음, 로그인 페이지로 리다이렉트");
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("콜백: 리다이렉트 처리 오류", error);
        router.push("/auth/signin");
      } finally {
        setIsRedirecting(false);
      }
    };

    // 사용자 정보 로딩이 완료된 경우에만 리다이렉트 처리
    if (!isUserLoading) {
      handleRedirect();
    }
  }, [
    isInitializing,
    isLoading,
    isUserLoading,
    isRedirecting,
    session,
    user,
    router,
    refetchUser,
    redirectTo,
  ]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-violet-500 rounded-full border-t-transparent mb-4"></div>
      <p className="text-gray-500">로그인 정보를 확인하는 중입니다...</p>
    </div>
  );
}
