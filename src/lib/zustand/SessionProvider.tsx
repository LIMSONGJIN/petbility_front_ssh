"use client";

import { useEffect } from "react";
import { useSessionStore } from "./useSessionStore"; // Zustand 전역 상태

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchSession } = useSessionStore();

  useEffect(() => {
    fetchSession(); // 앱 실행 시 세션 불러오기
  }, []);

  return <>{children}</>;
}
