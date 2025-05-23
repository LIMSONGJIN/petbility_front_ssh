"use client";

import { signInWithGoogle, signInWithKakao } from "@/utils/supabase/actions";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      // 로그인 성공 시 리다이렉트
      window.location.href = callbackUrl;
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <form onSubmit={handleSubmit} className="sign-form">
      <div>
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
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
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
            <Checkbox id="rememberMe" className="border-gray-400 rounded-sm" />
            <Label htmlFor="rememberMe">로그인 상태 유지</Label>
          </div>
          <Link
            className="underline text-blue-500 hover:text-blue-700 text-sm text-left"
            href="/auth/reset"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className="sign-btn w-full">
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4"
        >
          <FcGoogle className="h-5 w-5" />
          <span>Google로 계속하기</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("kakao")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#FEE500] text-black hover:bg-[#FFDD00] hover:text-black"
        >
          <RiKakaoTalkFill className="h-5 w-5 text-black" />
          <span>카카오로 계속하기</span>
        </Button>

        {searchParams.get("error") && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
            로그인 중 오류가 발생했습니다. 다시 시도해 주세요.
          </div>
        )}
      </div>

      <div className="flex w-full justify-center items-center gap-2 mt-2">
        <div className="text-gray-400 text-sm">계정이 없으신가요?</div>
        <Link
          href="/auth/signup"
          className="text-violet-500 underline underline-offset-2"
        >
          회원가입
        </Link>
      </div>
    </form>
  );
}
