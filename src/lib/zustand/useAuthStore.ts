import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  accessToken: null,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();

      // 세션 정보 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // 세션 토큰을 로컬 스토리지에 저장 (백엔드 API 호출용)
        localStorage.setItem("token", session.access_token);

        set({
          isAuthenticated: true,
          accessToken: session.access_token,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          accessToken: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("인증 초기화 오류:", error);
      set({
        error: "인증 상태를 확인하는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      set({
        isAuthenticated: false,
        accessToken: null,
      });
    } catch (error) {
      console.error("로그아웃 오류:", error);
      set({ error: "로그아웃에 실패했습니다." });
    }
  },
}));
