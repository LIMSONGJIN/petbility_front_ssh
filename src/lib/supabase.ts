import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL 또는 Anon Key가 정의되지 않았습니다.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 스토리지 버킷 이름
export const BUCKET_NAME = "profiles";

export default supabase;
