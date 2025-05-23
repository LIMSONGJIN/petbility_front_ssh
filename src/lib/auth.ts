import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

// Auth.js 설정
export const authOptions: NextAuthOptions = {
  // Prisma 어댑터 설정
  adapter: PrismaAdapter(prisma),

  // 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // 페이지 설정
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },

  // 제공자 설정
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 모두 입력해주세요");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("등록되지 않은 이메일입니다");
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordMatch) {
            throw new Error("비밀번호가 일치하지 않습니다");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
  ],

  // 콜백 설정
  callbacks: {
    async jwt({ token, user }) {
      // 초기 로그인 시 사용자 정보를 토큰에 추가
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";

        // JWT 토큰 생성 및 디코딩
        const jwtToken = jwt.sign(
          {
            name: user.name,
            email: user.email,
            sub: user.id,
            role: user.role,
          },
          process.env.NEXTAUTH_SECRET || "",
          { expiresIn: "30d" }
        );

        // 디코딩된 토큰 정보 출력
        const decodedToken = jwt.decode(jwtToken);
        console.log("Generated JWT Token:", jwtToken);
        console.log("Decoded JWT Token:", decodedToken);

        // 토큰 정보를 세션에서 사용할 수 있도록 저장
        token.jwt = jwtToken;
      }

      // 매번 호출될 때마다 최신 사용자 정보 확인
      if (token.id) {
        try {
          const latestUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });
          if (latestUser) {
            token.role = latestUser.role;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // JWT 토큰 정보를 세션에 추가
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.jwt = token.jwt; // JWT 토큰을 세션에 포함
      }

      return session;
    },
  },

  // 디버그 모드 (개발 환경에서만 활성화)
  debug: process.env.NODE_ENV === "development",
};

// 서버 컨텍스트에서 세션 가져오는 헬퍼 함수
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
