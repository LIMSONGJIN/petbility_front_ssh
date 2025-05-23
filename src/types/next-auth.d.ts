import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * 기본 세션에 사용자 역할 추가
   */
  interface Session {
    user: {
      id: string;
      role: string;
      phone?: string;
      address?: string;
    } & DefaultSession["user"];
  }

  /**
   * 기본 사용자에 역할 추가
   */
  interface User {
    role?: string;
    phone?: string;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰에 사용자 ID와 역할 추가
   */
  interface JWT {
    id?: string;
    role?: string;
    provider?: string;
  }
}
