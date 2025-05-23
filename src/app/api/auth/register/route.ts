import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  phone: z.string().optional(),
  role: z.enum(["USER", "BUSINESS"]).default("USER"),
});

export async function POST(req: Request) {
  try {
    console.log("회원가입 API 요청 수신");
    const body = await req.json();
    console.log("요청 데이터:", { ...body, password: "***" });

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      console.log("유효성 검사 실패:", validation.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: "입력값이 유효하지 않습니다.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = validation.data;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("이메일 중복:", email);
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
      ...(phone && { phone }),
    };

    console.log("사용자 생성 시도:", { ...userData, password: "***" });

    const user = await prisma.user.create({
      data: userData,
    });

    console.log("사용자 생성 성공:", user.id);

    // 비밀번호 필드 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordField, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: "회원가입이 완료되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
