"use client";

import InitUserSync from "@/utils/auth/InitUserSync";

export default function OAuthCallbackClientPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <InitUserSync />
      <div className="loading-spinner"></div>
    </div>
  );
}
