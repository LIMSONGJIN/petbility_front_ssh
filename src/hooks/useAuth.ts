"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/api";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // 권한 검사 함수
  const hasRole = (requiredRole: UserRole) => {
    if (!user) return false;

    const userRole = user.role as UserRole;

    switch (requiredRole) {
      case UserRole.ADMIN:
        return userRole === UserRole.ADMIN;
      case UserRole.BUSINESS:
        return userRole === UserRole.ADMIN || userRole === UserRole.BUSINESS;
      case UserRole.USER:
        return true; // 모든 인증된 사용자는 USER 권한이 있음
      default:
        return false;
    }
  };

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("supabase-credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        // 사용자 역할에 따라 리다이렉트
        if (user?.role === UserRole.ADMIN) {
          router.push("/admin");
        } else if (user?.role === UserRole.BUSINESS) {
          router.push("/business");
        } else {
          router.push("/");
        }
        return { success: true };
      }

      return { success: false, error: "로그인 실패" };
    } catch (error) {
      console.error("로그인 오류:", error);
      return { success: false, error: "로그인 중 오류 발생" };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/signin");
      return { success: true };
    } catch (error) {
      console.error("로그아웃 오류:", error);
      return { success: false, error: "로그아웃 중 오류 발생" };
    }
  };

  // 토큰 접근 함수
  const getToken = () => {
    return session?.accessToken || null;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: hasRole(UserRole.ADMIN),
    isBusiness: hasRole(UserRole.BUSINESS),
    hasRole,
    login,
    logout,
    getToken,
  };
}
