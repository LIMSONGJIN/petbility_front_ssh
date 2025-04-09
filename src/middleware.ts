import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// 공개 페이지 목록 (인증 없이 접근 가능)
const publicPaths = [
  "/auth/signin",
  "/auth/signup",
  "/auth/reset",
  "/auth/confirm",
  "/auth/callback",
  "/",
  "/about",
  "/contact",
  "/services",
  "/products",
  "/community",
];

// 정적 파일 경로 (이미지, CSS, JS 등)
const staticPaths = ["/_next", "/favicon.ico", "/images", "/fonts", "/api"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // 정적 파일은 미들웨어 처리 건너뛰기
  if (staticPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return response;
  }

  // 현재 경로가 공개 페이지인지 확인
  const isPublicPath = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 인증되지 않았고 공개 페이지가 아닌 경우 로그인 페이지로 리다이렉트
  if (!session && !isPublicPath) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 인증된 사용자의 경우 역할에 따른 라우팅
  if (session) {
    // 사용자 역할 확인 (백엔드 API 호출)
    try {
      const token = session.access_token;
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (userRes.ok) {
        const userData = await userRes.json();
        const userRole = userData.role;

        // 역할에 따른 라우팅
        if (userRole === "ADMIN") {
          // 어드민은 /admin 경로와 공개 경로에 접근 가능
          if (
            !request.nextUrl.pathname.startsWith("/admin") &&
            !isPublicPath &&
            request.nextUrl.pathname !== "/"
          ) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        } else if (userRole === "BUSINESS") {
          // 비즈니스 사용자는 /business 경로와 공개 경로에 접근 가능
          if (
            !request.nextUrl.pathname.startsWith("/business") &&
            !isPublicPath &&
            request.nextUrl.pathname !== "/"
          ) {
            return NextResponse.redirect(new URL("/business", request.url));
          }
        } else if (userRole === "USER") {
          // 일반 사용자는 /admin과 /business 경로에 접근 불가
          if (
            request.nextUrl.pathname.startsWith("/admin") ||
            request.nextUrl.pathname.startsWith("/business")
          ) {
            return NextResponse.redirect(new URL("/", request.url));
          }
        }
      }
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
    }
  }

  return response;
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|woff2?|ttf)).*)",
  ],
};
