"use client";

import { usePathname } from "next/navigation";
import PageBanner from "@/components/Layout/PageBanner";
import { Breadcrumb } from "@/components/Layout/Breadcrumb";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const pathname = usePathname();

  // 페이지별 배너 정보
  const getBannerInfo = () => {
    // 예약 관련 페이지
    if (pathname.startsWith("/reservation")) {
      return {
        title: "서비스 예약",
        subtitle: "다양한 펫 서비스를 예약하세요.",
      };
    }

    // 서비스 관련 페이지
    if (pathname.startsWith("/service")) {
      return {
        title: "서비스",
        subtitle: "펫빌리티의 다양한 서비스를 이용해보세요.",
      };
    }

    // 쇼핑 관련 페이지
    if (pathname.startsWith("/shopping")) {
      return {
        title: "쇼핑",
        subtitle: "반려동물을 위한 다양한 상품을 만나보세요.",
      };
    }

    // 내 정보 관련 페이지
    if (pathname.startsWith("/info")) {
      return {
        title: "펫빌리티 소개",
        subtitle: "펫빌리티에 대한 소개입니다.",
      };
    }

    // 기본 배너 정보
    return {
      title: "펫빌리티",
      subtitle: "반려동물과 함께하는 행복한 일상",
    };
  };

  // 페이지별 브레드크럼 정보
  const getBreadcrumbs = () => {
    const baseCrumbs = [{ label: "홈", href: "/" }];

    // 예약 관련 페이지
    if (pathname.startsWith("/reservation")) {
      if (pathname === "/reservation") {
        return [...baseCrumbs, { label: "서비스 예약" }];
      }
      return [
        ...baseCrumbs,
        { label: "서비스", href: "/service" },
        { label: "예약하기" },
      ];
    }

    // 서비스 관련 페이지
    if (pathname.startsWith("/service")) {
      if (pathname === "/service") {
        return [...baseCrumbs, { label: "서비스" }];
      }
      return [
        ...baseCrumbs,
        { label: "서비스", href: "/service" },
        { label: "서비스 상세" },
      ];
    }

    // 쇼핑 관련 페이지
    if (pathname.startsWith("/shopping")) {
      if (pathname === "/shopping") {
        return [...baseCrumbs, { label: "쇼핑" }];
      }
      return [
        ...baseCrumbs,
        { label: "쇼핑", href: "/shopping" },
        { label: "상품 상세" },
      ];
    }

    // 내 정보 관련 페이지
    if (pathname.startsWith("/info")) {
      if (pathname === "/info") {
        return [...baseCrumbs, { label: "내 정보" }];
      }
      return [
        ...baseCrumbs,
        { label: "내 정보", href: "/info" },
        { label: "정보 수정" },
      ];
    }

    return baseCrumbs;
  };

  const bannerInfo = getBannerInfo();
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title={bannerInfo.title}
        subtitle={bannerInfo.subtitle}
        backgroundImage="/images/user-banner.jpg"
      />
      <Breadcrumb crumbs={breadcrumbs} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
