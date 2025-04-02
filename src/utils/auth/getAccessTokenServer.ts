// 📁 src/utils/auth/getAccessTokenServer.ts
import { createClientForServer } from "@/utils/supabase/server";

export async function getAccessTokenServer(): Promise<string> {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("서버: 로그인 필요");
  return token;
}
