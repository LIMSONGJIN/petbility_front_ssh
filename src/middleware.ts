import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// 보호된 경로 (인증 필요)
const protectedPaths = ["/admin", "/business"];

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const pathname = request.nextUrl.pathname;

    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // ✅ 1. 루트(/) 페이지에 있을 때 로그인한 유저를 역할에 따라 리다이렉트
    if (pathname === "/" && session) {
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

          if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
          } else if (userRole === "BUSINESS") {
            return NextResponse.redirect(new URL("/business", request.url));
          }
        }
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        // 백엔드 서버 연결 실패 시에도 프론트엔드는 계속 작동하도록 함
        return response;
      }
    }

    // ✅ 2. 보호된 경로 접근 시 로그인 여부 체크
    if (isProtectedPath) {
      if (!session) {
        const redirectUrl = new URL("/auth/signin", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }

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

          if (userRole === "ADMIN") {
            return response;
          } else if (userRole === "BUSINESS" && pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/business", request.url));
          } else if (userRole === "USER") {
            return NextResponse.redirect(new URL("/", request.url));
          }
        }
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        // 백엔드 서버 연결 실패 시에도 프론트엔드는 계속 작동하도록 함
        // 단, 보호된 경로는 여전히 세션이 있어야 접근 가능
        if (session) {
          return response;
        } else {
          const redirectUrl = new URL("/auth/signin", request.url);
          redirectUrl.searchParams.set("redirectTo", pathname);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // ✅ 그 외에는 기본 통과
    return response;
  } catch (error) {
    console.error("미들웨어 오류:", error);
    // 미들웨어 자체에서 오류가 발생해도 프론트엔드는 계속 작동하도록 함
    return NextResponse.next();
  }
}

// 미들웨어 적용 경로 (추가로 루트도 검사하려면 "/" 포함)
export const config = {
  matcher: ["/", "/admin/:path*", "/business/:path*"],
};
