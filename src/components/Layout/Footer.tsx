import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    href: "/service",
    name: "서비스 소개",
  },
  { name: "서비스 예약", href: "/reservations" },
  { name: "추모 공간", href: "/community" },
  { name: "용품샵", href: "/shopping" },
];

const footerLinks2 = [
  { name: "이용약관", href: "/terms" },
  { name: "개인정보처리방침", href: "/privacy" },
  { name: "문의하기", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {/* 회사 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">펫빌리티</h3>
          <p className="text-sm">반려동물을 위한 맞춤형 서비스</p>
          <p className="text-sm mt-2">주소: 서울시 강남구</p>
          <p className="text-sm">이메일: contact@petbility.com</p>
          <p className="text-sm">전화: 02-1234-5678</p>
        </div>

        {/* 메뉴 링크 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">바로가기</h3>
          <ul className="space-y-0.5">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-violet-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 고객 지원 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">고객 지원</h3>
          <ul className="space-y-0.5">
            {footerLinks2.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-violet-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SNS & 뉴스레터 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">팔로우</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="#"
              className="flex items-center text-sm hover:text-violet-400 transition"
            >
              <Facebook size={16} className="mr-1 text-blue-500" /> Facebook
            </Link>
            <Link
              href="#"
              className="flex items-center text-sm hover:text-violet-400 transition"
            >
              <Instagram size={16} className="mr-1 text-pink-500" /> Instagram
            </Link>
            <Link
              href="#"
              className="flex items-center text-sm hover:text-violet-400 transition"
            >
              <Twitter size={16} className="mr-1 text-blue-400" /> Twitter
            </Link>
          </div>
        </div>
      </div>

      {/* 저작권 */}
      <div className="text-center text-sm text-gray-400 mt-4 border-t border-gray-700 pt-4">
        © 2025 펫빌리티. All rights reserved.
      </div>
    </footer>
  );
}
