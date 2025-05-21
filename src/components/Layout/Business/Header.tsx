"use client";

import { Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/useAuthStore";

const menuItems = [
  { title: "대시보드", href: "/business/dashboard" },
  { title: "예약 관리", href: "/business/reservations" },
  { title: "서비스 관리", href: "/business/services" },
  { title: "고객 관리", href: "/business/customers" },
  { title: "매출 관리", href: "/business/revenue" },
  { title: "리뷰 관리", href: "/business/reviews" },
  { title: "설정", href: "/business/settings" },
];

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const { session, signOut } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {menuItems.find((item) => item.href === pathname)?.title}
        </h2>
        <div className="flex items-center gap-4">
          {/* <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button> */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
              {session?.user?.user_metadata?.profile_image ? (
                <Image
                  src={session.user.user_metadata.profile_image}
                  alt="프로필 이미지"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-violet-600 font-semibold">
                  {session?.user?.user_metadata?.name?.[0] || "?"}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {session?.user?.user_metadata?.name || "사용자"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}
