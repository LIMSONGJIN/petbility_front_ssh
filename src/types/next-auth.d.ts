import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "./api";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
    role: string;
    accessToken: string;
  }
}
