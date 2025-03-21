"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Search, Bell, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { AuthSession } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/services",
    name: "소개",
    submenu: [
      { name: "장례 서비스", href: "/services/funeral" },
      { name: "미용 · 목욕 서비스", href: "/services/grooming" },
      { name: "맞춤형 차량 제작", href: "/services/custom-vehicles" },
      { name: "기타 반려동물 케어", href: "/services/other-care" },
    ],
  },
  {
    href: "/reservations",
    name: "서비스 예약",
    submenu: [
      { name: "장례 서비스 예약", href: "/reservations/funeral" },
      { name: "미용 · 목욕 서비스 예약", href: "/reservations/grooming" },
    ],
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
    href: "/shop",
    name: "식·용품샵",
    submenu: [{ name: "식·용품샵", href: "/shop" }],
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { session } = useSessionStore();

  // 로그아웃 처리
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
      <div className="container mx-auto flex justify-between gap-0 md:gap-10 lg:gap-40 xl:justify-between items-center py-4 px-6 z-20">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src="/animal.png" alt="로고" width={36} height={36} />
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
        <div className=" flex items-center space-x-2">
          <button className="header-btn-text">
            <Search size={20} />
          </button>

          {/* 로그인 상태: 아이콘 & 프로필 표시 */}
          {session ? (
            <>
              <button className="header-btn-text">
                <Bell size={20} />
              </button>
              <button className="header-btn-text">
                <ShoppingCart size={20} />
              </button>
              {/* 프로필 & 드롭다운 */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <Image
                    src={
                      session.user.user_metadata.profile_image ||
                      "/default-avatar.svg"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-gray-700">
                    {session.user.user_metadata.name}
                  </span>
                  <ChevronDown size={18} className="text-gray-700" />
                </button>

                {/* 드롭다운 메뉴 */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute -right-10 mt-4 w-48 bg-white rounded-t-none rounded-lg overflow-hidden shadow-md"
                    >
                      <Link href="/profile" className="header-profile-link">
                        내 정보 관리
                      </Link>
                      <Link href="/pets" className="header-profile-link">
                        반려동물 관리
                      </Link>
                      <Link href="/inquiries" className="header-profile-link">
                        문의하기
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                      >
                        로그아웃
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* 비로그인 상태: 로그인 버튼 + 마름모 배경 표시 */
            <>
              <div
                className="absolute hidden md:flex right-0 h-[68px] w-[300px] md:w-[200px] lg:w-[250px]"
                style={{
                  background: "linear-gradient(to right, violet, purple)",
                  clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 20% 0%)",
                }}
              >
                <div className=" relative h-full flex items-center justify-end">
                  <Link
                    href="/auth/signin"
                    className="hidden md:flex z-30 -right-28 button--nina rounded-full px-4 py-2"
                    data-text="LogIn"
                  >
                    <button>
                      <span>L</span>
                      <span>o</span>
                      <span>g</span>
                      <span>I</span>
                      <span>n</span>
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}

          <button
            className="flex md:hidden p-2 text-gray-700"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <Menu size={24} />
          </button>
        </div>
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
            <div className="container mx-auto grid grid-cols-4 gap-8 py-4 px-6">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    {link.name}
                  </h3>
                  <ul>
                    {link.submenu.map((item, index) => (
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
