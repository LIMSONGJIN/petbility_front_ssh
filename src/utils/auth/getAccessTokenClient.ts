// 📁 src/utils/auth/getAccessTokenClient.ts
import { createClient } from "@/utils/supabase/client";

export async function getAccessTokenClient(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("클라이언트: 로그인 필요");
  return token;
}
