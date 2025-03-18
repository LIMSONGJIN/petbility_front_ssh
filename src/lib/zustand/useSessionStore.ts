import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { AuthSession } from "@supabase/supabase-js";

interface SessionState {
  session: AuthSession | null;
  fetchSession: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  fetchSession: async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    set({ session: data.session });

    // ✅ 로그인 상태 변경 감지하여 자동 업데이트
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
}));
