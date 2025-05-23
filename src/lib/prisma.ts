import { PrismaClient } from "@prisma/client";

// PrismaClient는 글로벌 단일 인스턴스로 사용하기 위해 선언
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 개발 환경에서 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
