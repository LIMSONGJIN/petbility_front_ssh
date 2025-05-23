"use client";

import { signupWithEmailPassword } from "@/utils/supabase/actions";
import { useActionState } from "react";
import { useState, useRef, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function RegisterForm({
  agreements,
}: {
  agreements: { terms: boolean; privacy: boolean };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    baseAddress: "",
    detailAddress: "",
    role: "USER",
    latitude: 0,
    longitude: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const agreementRef = useRef<HTMLDivElement | null>(null);

  const inputLabel = [
    { label: "이름", name: "name", type: "text", required: true },
    { label: "이메일", name: "email", type: "email", required: true },
    { label: "비밀번호", name: "password", type: "password", required: true },
    {
      label: "비밀번호 확인",
      name: "confirmPassword",
      type: "password",
      required: true,
    },
    { label: "전화번호", name: "phone", type: "tel", required: true },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 입력 필드가 변경되면 해당 필드의 오류 메시지 제거
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleAddressSelect = (data: any) => {
    setFormData({
      ...formData,
      baseAddress: `${data.zonecode} ${data.address}`,
      detailAddress: "",
      address: `${data.zonecode} ${data.address}`,
      latitude: 0,
      longitude: 0,
    });
    setIsAddressOpen(false);
  };

  const handleDetailAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDetailAddress = e.target.value;
    setFormData({
      ...formData,
      detailAddress: newDetailAddress,
      address: `${formData.baseAddress} ${newDetailAddress}`.trim(),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "이름은 최소 2자 이상이어야 합니다.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);

    // 유효성 검사 실패 시 첫 번째 에러 메시지를 toast로 표시
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 폼 기본 동작 방지
    console.log("회원가입 폼 제출 시작");

    if (!agreements.terms || !agreements.privacy) {
      console.log("약관 동의 필요");
      toast.error("필수 약관에 동의해야 회원가입이 가능합니다.", {
        position: "top-right",
        autoClose: 3000,
      });

      agreementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (!validateForm()) {
      console.log("폼 유효성 검사 실패");
      return;
    }

    setIsLoading(true);
    console.log("회원가입 요청 시작:", { ...formData, password: "***" });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          role: formData.role,
        }),
      });

      const data = await response.json();
      console.log("회원가입 응답:", data);

      if (!response.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value)
              ? value[0]
              : (value as string);
          });
          setErrors(fieldErrors);

          // API 응답 에러 메시지를 toast로 표시
          const firstError = Object.values(fieldErrors)[0];
          toast.error(firstError || "입력 정보를 확인해주세요.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(data.error || "회원가입에 실패했습니다.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        return;
      }

      toast.success("회원가입이 완료되었습니다. 로그인해주세요.", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      toast.error("회원가입 중 오류가 발생했습니다.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="sign-form">
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="USER"
              checked={formData.role === "USER"}
              onChange={handleRoleChange}
            />
            일반 사용자
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="BUSINESS"
              checked={formData.role === "BUSINESS"}
              onChange={handleRoleChange}
            />
            사업자
          </label>
        </div>

        {inputLabel.map(({ label, name, type, required }) => (
          <div key={name} className="flex flex-col gap-1 relative">
            <label className="flex items-center gap-1">
              {label}{" "}
              {required && <span className="text-xs text-orange-700">＊</span>}
            </label>
            <div className="relative">
              <input
                className="sign-input w-full pr-10"
                type={
                  name === "password" || name === "confirmPassword"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                name={name}
                placeholder={label}
                required={required}
                onChange={handleChange}
              />
              {(name === "password" || name === "confirmPassword") && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
            {errors[name] && (
              <span className="text-red-500 text-sm">{errors[name]}</span>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1">주소</label>
          <div className="flex gap-2">
            <input
              className="sign-input flex-1"
              type="text"
              name="address"
              placeholder="우편번호 + 주소"
              value={formData.address}
              readOnly
            />
            <button
              type="button"
              className="sign-btn"
              onClick={() => setIsAddressOpen(true)}
            >
              주소 검색
            </button>
          </div>
          {isAddressOpen && (
            <DaumPostcode onComplete={handleAddressSelect} autoClose={false} />
          )}
          <input
            className="sign-input mt-2"
            type="text"
            name="detailAddress"
            placeholder="상세 주소 입력"
            value={formData.detailAddress}
            onChange={handleDetailAddressChange}
          />
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            className="sign-btn bg-white hover:bg-gray-100 text-violet-500"
            onClick={() => router.push("/auth/login")}
          >
            취소
          </button>
          <button type="submit" disabled={isLoading} className="sign-btn">
            {isLoading ? "회원가입 중..." : "회원가입"}
          </button>
        </div>

        <div ref={agreementRef} />
      </form>
    </>
  );
}
