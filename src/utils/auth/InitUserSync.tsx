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

      // 로컬 스토리지에서 토큰 확인
      const localToken = localStorage.getItem("token");
      console.log("로컬 스토리지 토큰:", localToken ? "존재함" : "없음");

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Supabase 세션:", session ? "존재함" : "없음");

      if (!session?.user) {
        console.log("세션 또는 사용자 없음");
        router.replace("/auth/signin");
        return;
      }

      // 토큰 처리 - 세션 또는 로컬스토리지에서 가져옴
      let token = session.access_token;
      if (!token && localToken) {
        console.log("세션에 토큰이 없어 로컬 스토리지의 토큰 사용");
        token = localToken;
      } else if (token) {
        console.log("세션에서 토큰 가져옴");
        // 토큰을 로컬 스토리지에 다시 저장
        localStorage.setItem("token", token);
      }

      if (!token) {
        console.log("토큰을 찾을 수 없음");
        router.replace("/auth/signin");
        return;
      }

      const user = session.user;
      console.log("인증된 사용자:", user.email);

      try {
        console.log("백엔드 API 호출 시작");
        console.log("사용하는 토큰:", token.substring(0, 10) + "...");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("백엔드 응답 상태:", res.status);

        let userData;

        if (res.status === 404) {
          console.log("사용자 정보가 없어 회원가입 진행");
          const signupRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                user_id: user.id,
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

        console.log("사용자 데이터:", userData);
        console.log("사용자 역할:", userData.role);

        await fetchSession();

        // 역할에 따라 즉시 라우팅
        switch (userData.role) {
          case "ADMIN":
            console.log("관리자로 리다이렉트");
            router.push("/admin");
            break;
          case "BUSINESS":
            console.log("비즈니스 계정으로 리다이렉트");
            router.push("/business");
            break;
          default:
            console.log("일반 사용자로 리다이렉트");
            router.push("/");
        }

        setSynced(true);
      } catch (err) {
        console.error("InitUserSync 오류:", err);
        router.replace("/auth/signin");
      }
    };

    syncUser();
  }, [fetchSession, router, synced]);

  return null;
}
