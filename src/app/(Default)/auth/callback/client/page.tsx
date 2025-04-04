"use client";

import InitUserSync from "@/utils/auth/InitUserSync";

export default function OAuthCallbackClientPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <InitUserSync />
      <p className="text-sm text-gray-500">로그인 중입니다...</p>
    </div>
  );
}
