import { createClient } from "@/utils/supabase/client";
import { createClientForServer } from "@/utils/supabase/server";

/**
 * Supabase access_token을 SSR/CSR 환경에 맞게 가져옵니다.
 * @param isServer SSR 환경 여부 (기본값: false → CSR)
 */
export async function getAccessToken(isServer = false): Promise<string> {
  if (isServer) {
    const supabase = await createClientForServer();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) throw new Error("서버: 로그인 필요");
    return token;
  } else {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) throw new Error("클라이언트: 로그인 필요");
    return token;
  }
}
