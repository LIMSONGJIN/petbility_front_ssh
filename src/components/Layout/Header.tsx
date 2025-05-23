"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Search, Bell, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { UserProfile } from "../Forms/UserProfile";

const navLinks = [
  {
    href: "/info",
    name: "펫빌리티",
    submenu: [{ name: "펫빌리티 소개", href: "/info" }],
  },
  {
    href: "/service",
    name: "서비스",
    submenu: [
      { name: "화장 서비스", href: "/service/cremation" },
      { name: "장례 서비스", href: "/service/funeral" },
      { name: "미용 서비스", href: "/service/grooming" },
      { name: "목욕 서비스", href: "/service/bathing" },
      { name: "맞춤형 차량 제작", href: "/service/custom-vehicles" },
      { name: "기타 반려동물 케어", href: "/service/other-care" },
    ],
  },
  {
    href: "#",
    name: "온라인 문의",
    submenu: [{ name: "온라인 문의", href: "#" }],
  },
  {
    href: "/community",
    name: "추모 공간",
    submenu: [
      { name: "공지사항", href: "/community/notice" },
      { name: "메타버스 공간", href: "/community/metaverse" },
      { name: "온라인 추모 갤러리", href: "/community/memorial-gallery" },
    ],
  },
  {
    href: "/shopping",
    name: "식·용품샵",
    submenu: [{ name: "식·용품샵", href: "/shopping" }],
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { session, signOut } = useAuthStore();

  // 로그아웃 처리
  const handleSignOut = async () => {
    await signOut();
  };

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setTimeout(() => {
          setIsOpen(false);
        }, 100); // 🔹 클릭 후 100ms 지연
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className=" w-full bg-white shadow-md fixed top-0 z-50">
      <div className="container mx-auto flex justify-between gap-0 md:gap-4 lg:gap-32 xl:justify-between items-center py-4 px-6 z-20">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src="/logo.svg" alt="로고" width={36} height={36} />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 lg:gap-8">
          {navLinks.map((link) =>
            pathname.startsWith(link.href) ? (
              // ✅ 활성화된 메뉴 (보라색)
              <Link
                key={link.href}
                href={link.href}
                className="dropdown-menu-active"
                onMouseEnter={() => setMenuDropdownOpen(true)}
              >
                {link.name}
              </Link>
            ) : (
              // ✅ 비활성화된 메뉴 (기본 스타일)
              <Link
                key={link.href}
                href={link.href}
                className="dropdown-menu"
                onMouseEnter={() => setMenuDropdownOpen(true)}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Right Side - 로그인 상태별 UI 변경 */}
        <UserProfile />
      </div>

      <AnimatePresence>
        {menuDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 w-full bg-white bg-opacity-50 backdrop-blur-md shadow-lg border-gray-200"
            onMouseLeave={() => setMenuDropdownOpen(false)}
          >
            <div className="container mx-auto flex justify-around gap-8 py-4 px-6">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    {link.name}
                  </h3>
                  <ul>
                    {link.submenu?.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="block text-gray-700 hover:text-violet-600 transition"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="md:hidden bg-white shadow-lg p-4 absolute top-16 left-0 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-violet-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <Button className="w-full mt-4" onClick={handleSignOut}>
                LogOut
              </Button>
            ) : (
              <Button className="w-full mt-4">
                <Link href="/auth/signin">LogIn</Link>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
