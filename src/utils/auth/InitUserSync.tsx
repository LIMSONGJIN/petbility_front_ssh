"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import { usePathname, useRouter } from "next/navigation";

export default function InitUserSync() {
  const [synced, setSynced] = useState(false);
  const { fetchSession } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = async () => {
      if (synced) return;

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const token = localStorage.getItem("token");
      const user = session.user;

      try {
        // ✅ 내 DB에서 유저 조회
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userData;

        // ❌ 없으면 → 신규 유저 → DB 저장
        if (res.status === 404) {
          const signupRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.user_metadata.name || "",
                phone: user.user_metadata.phone || "",
                profileImage: user.user_metadata.profileImage || "",
                address: user.user_metadata.address || "",
                role: user.user_metadata.role || "USER",
              }),
            }
          );

          userData = await signupRes.json();
        } else {
          userData = await res.json();
        }

        // ✅ 세션 상태 동기화
        await fetchSession();
        setSynced(true);

        // ✅ role에 따라 리디렉션
        if (pathname === "/") {
          switch (userData.role) {
            case "ADMIN":
              router.replace("/admin");
              break;
            case "BUSINESS":
              router.replace("/business");
              break;
            default:
              router.replace("/");
          }
        }
      } catch (err) {
        console.error("InitUserSync 오류:", err);
      }
    };

    syncUser();
  }, [fetchSession, router, synced]);

  return null;
}
