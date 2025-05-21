"use client";

import {
  signinWithEmailPassword,
  signInWithGoogle,
  signInWithKakao,
} from "@/utils/supabase/actions";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/api";

interface SignInFormProps {
  redirectTo?: string;
}

const SignInForm = ({ redirectTo = "/" }: SignInFormProps) => {
  const router = useRouter();
  const { initializeAuth, setAuthToken } = useAuthStore();
  const { refetch: refetchUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  const [error, formAction, isPending] = useActionState<
    { message?: string; success?: boolean }, // 반환 타입
    FormData // formData 타입
  >(async (_prev, formData) => {
    const result = await signinWithEmailPassword(null, formData);

    if (result?.success) {
      setIsProcessingLogin(true);
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (data?.session?.access_token) {
        console.log(
          "액세스 토큰 저장:",
          data.session.access_token.substring(0, 10) + "..."
        );
        // 토큰 상태 관리 통합
        setAuthToken(data.session.access_token);

        try {
          // 세션 초기화 (fetchSession 대신 initializeAuth 사용)
          await initializeAuth();

          // 사용자 정보 갱신
          await refetchUser();

          // 로그인 성공 후 역할 확인을 위해 콜백 페이지로 리다이렉션
          // 콜백 페이지에서 더 정확하게 역할 기반 라우팅 처리
          console.log("로그인 성공: 콜백 페이지로 이동");
          router.push(`/auth/callback/client?redirectTo=${redirectTo}`);
        } catch (err) {
          console.error("로그인 후 데이터 초기화 오류:", err);
          router.push("/auth/callback/client");
        } finally {
          setIsProcessingLogin(false);
        }
      } else {
        console.log("세션에 액세스 토큰이 없음");
        router.push("/auth/callback/client");
      }
    } else {
      console.log("로그인 실패:", result?.message);
    }

    return result;
  }, {});

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleRememberMe = (checked: boolean) => {
    setRememberMe(checked);

    if (checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
      setEmail("");
    }
  };

  const inputLabel = [
    {
      label: "이메일",
      name: "email",
      type: "email",
      required: true,
      placeholder: "이메일을 입력해주세요",
    },
    {
      label: "비밀번호",
      name: "password",
      type: "password",
      required: true,
      placeholder: "비밀번호를 입력해주세요",
    },
  ];

  return (
    <div className="sign-form">
      <form
        action={formAction}
        onSubmit={(e) => {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          }
        }}
      >
        {inputLabel.map(({ label, name, type, required, placeholder }) => (
          <div key={name} className="flex flex-col gap-1 relative">
            <label className="flex items-center gap-1">{label} </label>
            <div className="relative">
              <input
                className="sign-input w-full pr-10"
                type={
                  name === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                name={name}
                placeholder={placeholder}
                required={required}
                value={name === "email" ? email : undefined}
                onChange={(e) => {
                  if (name === "email") setEmail(e.target.value);
                }}
              />
              {name === "password" && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              className="border-gray-400 rounded-sm"
              checked={rememberMe}
              onCheckedChange={handleRememberMe}
            />
            <Label htmlFor="rememberMe">로그인 상태 유지</Label>
          </div>
          <Link
            className="underline text-blue-500 hover:text-blue-700 text-sm text-left"
            href="/auth/reset"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <button
          disabled={isPending || isProcessingLogin}
          className="sign-btn w-full"
        >
          {isPending || isProcessingLogin ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <form className="flex justify-between items-center w-full max-w-2xl mt-4">
        <button formAction={signInWithGoogle}>
          <Image
            src="/web_light_sq_SI.svg"
            alt="구글 로그인"
            width={171.5}
            height={40}
          />
        </button>
        <button formAction={signInWithKakao}>
          <Image
            src="/kakao_login_medium_narrow.png"
            alt="카카오 로그인"
            width={162.5}
            height={40}
          />
        </button>
      </form>

      <div className="flex w-full justify-center items-center gap-2 mt-2">
        <div className="text-gray-400 text-sm">계정이 없으신가요?</div>
        <Link
          href="/auth/signup"
          className="text-violet-500 underline underline-offset-2"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
