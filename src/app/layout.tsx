import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import AuthProvider from "@/components/Providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:7777"
  ),
  title: "펫빌리티 | 반려동물 장례 · 미용 · 케어 & 용품샵",
  description:
    "이동식 반려동물 장례, 미용, 목욕 서비스부터 맞춤형 차량 제작·렌트, 그리고 반려동물 용품까지! 반려동물의 마지막 여정과 삶을 함께하는 펫빌리티.",
  keywords: [
    "반려동물 장례",
    "이동식 장례 서비스",
    "강아지 미용",
    "반려동물 목욕",
    "반려동물 차량 제작",
    "펫 용품",
    "펫빌리티",
    "강아지 용품",
    "고양이 용품",
  ],
  openGraph: {
    title: "펫빌리티 🐾 | 반려동물 장례 · 미용 · 용품까지",
    description:
      "이동식 장례, 미용, 목욕, 맞춤 차량 제작부터 펫 용품까지 한 곳에서! 반려동물을 위한 종합 플랫폼 펫빌리티.",
    url: "https://pet.metashopping.kr",
    siteName: "펫빌리티",
    images: [
      {
        url: "/opengraph/main-preview.png", // 대표 이미지 위치
        width: 1200,
        height: 630,
        alt: "펫빌리티 대표 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "펫빌리티 | 반려동물 장례 · 미용 · 용품까지",
    description:
      "장례부터 케어, 차량 제작과 용품까지. 반려동물과 보호자를 위한 종합 서비스.",
    images: ["/opengraph/main-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AuthProvider>
            <div>{children}</div>
            <ToastContainer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
