"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import { useRouter } from "next/navigation";

export default function InitUserSync() {
  const [synced, setSynced] = useState(false);
  const { fetchSession } = useSessionStore();
  const router = useRouter();

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let userData;

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

        await fetchSession();

        // ✅ 무조건 role에 따라 라우팅
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

        setSynced(true);
      } catch (err) {
        console.error("InitUserSync 오류:", err);
      }
    };

    syncUser();
  }, [fetchSession, router, synced]);

  return null;
}
