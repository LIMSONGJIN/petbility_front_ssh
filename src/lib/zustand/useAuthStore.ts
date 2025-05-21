import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { AuthSession } from "@supabase/supabase-js";

interface AuthState {
  // 인증 상태
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  // 세션 상태
  session: AuthSession | null;
  isSessionLoading: boolean;
  sessionError: Error | null;

  // 메서드
  initializeAuth: () => Promise<void>;
  fetchSession: () => Promise<void | (() => void)>;
  signOut: () => Promise<void>;
  setAuthToken: (token: string) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 인증 상태 초기값
  isAuthenticated: false,
  isLoading: true,
  error: null,
  accessToken: null,

  // 세션 상태 초기값
  session: null,
  isSessionLoading: false,
  sessionError: null,

  // 세션 정보 조회 및 업데이트
  fetchSession: async () => {
    try {
      set({ isSessionLoading: true, sessionError: null });

      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      const token = data.session?.access_token;

      set({
        session: data.session,
        isSessionLoading: false,
        // 세션이 있으면 인증 상태도 함께 업데이트
        ...(data.session && {
          isAuthenticated: true,
          accessToken: token,
          isLoading: false,
        }),
      });

      // 세션 있으면 토큰 저장
      if (token) {
        localStorage.setItem("token", token);

        try {
          document.cookie = `supabase-auth-token=${token}; path=/; max-age=86400`;
        } catch (e) {
          console.error("useAuthStore: 쿠키 저장 실패:", e);
        }
      }

      // 세션 변경 이벤트 리스너 설정
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          ...(session && {
            isAuthenticated: true,
            accessToken: session.access_token,
            isLoading: false,
          }),
          ...(!session && {
            isAuthenticated: false,
            accessToken: null,
            isLoading: false,
          }),
        });

        // 토큰 업데이트
        if (session?.access_token) {
          localStorage.setItem("token", session.access_token);
        }
      });

      // 컴포넌트 언마운트 시 구독 취소
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("세션 정보 조회 오류:", error);
      set({
        sessionError: error as Error,
        isSessionLoading: false,
      });
    }
  },

  // 인증 초기화 - 세션 조회 및 토큰 확인
  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });

      // 세션 정보 가져오기 - 명시적으로 await 사용
      const unsubscribe = await get().fetchSession();

      // unsubscribe가 반환되었다면 후처리 작업도 설정
      if (typeof unsubscribe === "function") {
        // unsubscribe 함수는 컴포넌트 언마운트 시 호출됨
        // 필요시 별도 처리 가능
      }

      // 세션이 없지만 로컬 스토리지에 토큰이 있는 경우 확인
      if (!get().session) {
        const localToken = localStorage.getItem("token");
        if (localToken) {
          set({
            isAuthenticated: true,
            accessToken: localToken,
            isLoading: false,
          });
        } else {
          set({
            isAuthenticated: false,
            accessToken: null,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error("인증 초기화 오류:", error);
      // 오류 발생 시 인증 상태 초기화
      set({
        error: "인증 상태를 확인하는데 실패했습니다.",
        isLoading: false,
        isAuthenticated: false,
        accessToken: null,
      });
    }
  },

  // 토큰 직접 설정 (로그인 또는 세션 복구 시)
  setAuthToken: (token: string) => {
    if (!token) return;

    localStorage.setItem("token", token);

    try {
      document.cookie = `supabase-auth-token=${token}; path=/; max-age=86400`;
    } catch (e) {
      console.error("useAuthStore: 쿠키 저장 실패:", e);
    }

    set({
      isAuthenticated: true,
      accessToken: token,
      isLoading: false,
      error: null,
    });
  },

  // 인증 상태 초기화 (명시적인 토큰 및 상태 클리어)
  clearAuthState: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    try {
      document.cookie = "supabase-auth-token=; path=/; max-age=0";
    } catch (e) {
      console.error("useAuthStore: 쿠키 삭제 실패:", e);
    }

    set({
      isAuthenticated: false,
      accessToken: null,
      isLoading: false,
      error: null,
      session: null,
      sessionError: null,
    });
  },

  // 로그아웃
  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      // 로컬 스토리지 완전 정리
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      // 세션 관련 전체 데이터 정리
      localStorage.removeItem("supabase.auth.token");

      // QueryClient 캐시 정리
      if (window.__REACT_QUERY_GLOBAL_CLIENT__) {
        window.__REACT_QUERY_GLOBAL_CLIENT__.clear();
      }

      // 캐시 관련 스토리지 삭제
      sessionStorage.clear();

      // 쿠키 삭제
      document.cookie = "supabase-auth-token=; path=/; max-age=0";
      document.cookie = "sb-access-token=; path=/; max-age=0";
      document.cookie = "sb-refresh-token=; path=/; max-age=0";

      console.log("로그아웃 완료: 모든 인증 데이터 삭제됨");

      set({
        isAuthenticated: false,
        accessToken: null,
        session: null,
        sessionError: null,
      });

      // 페이지 새로고침 대신 라우터로 이동
      // 더 나은 사용자 경험을 위해 로그아웃 후 홈으로 리다이렉션
      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);

      // 오류가 있어도 상태 및 토큰은 클리어 (로그아웃 보장)
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      sessionStorage.clear();

      set({
        error: "로그아웃에 실패했습니다.",
        isAuthenticated: false,
        accessToken: null,
        session: null,
      });

      // 오류 발생 후에도 로그인 페이지로 리다이렉션
      window.location.href = "/auth/signin";
    }
  },
}));

// React Query 전역 클라이언트 타입 선언
declare global {
  interface Window {
    __REACT_QUERY_GLOBAL_CLIENT__?: {
      clear: () => void;
    };
  }
}
