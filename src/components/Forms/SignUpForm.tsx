"use client";

import { signupWithEmailPassword } from "@/utils/supabase/actions";
import { useActionState } from "react";
import { useState, useRef, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = ({
  agreements,
}: {
  agreements: { terms: boolean; privacy: boolean };
}) => {
  const [error, formAction, isPending] = useActionState(
    signupWithEmailPassword,
    null
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    baseAddress: "",
    detailAddress: "",
    role: "USER",
  });

  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const agreementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const inputLabel = [
    { label: "이메일", name: "email", type: "email", required: true },
    { label: "비밀번호", name: "password", type: "password", required: true },
    { label: "이름", name: "name", type: "text", required: true },
    { label: "전화번호", name: "phone", type: "tel", required: true },
  ];

  const handleSubmit = (event: React.FormEvent) => {
    if (!agreements.terms || !agreements.privacy) {
      event.preventDefault();
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
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="sign-form">
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
                name === "password"
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
        >
          취소
        </button>
        <button disabled={isPending} className="sign-btn">
          {isPending ? "회원가입 중..." : "회원가입"}
        </button>
      </div>

      <div ref={agreementRef} />
    </form>
  );
};

export default SignUpForm;
