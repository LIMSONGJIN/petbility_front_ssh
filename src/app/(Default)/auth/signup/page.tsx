"use client";

import SignUpForm from "@/components/Forms/SignUpForm";
import Link from "next/link";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SignUpPage = () => {
  const [agreements, setAgreements] = useState<{
    all: boolean;
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  }>({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const termsRef = useRef<HTMLDivElement | null>(null);
  const privacyRef = useRef<HTMLDivElement | null>(null);
  const marketingRef = useRef<HTMLDivElement | null>(null);

  const handleCheck = (name: keyof typeof agreements) => {
    if (name === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
        marketing: newValue,
      });
    } else {
      setAgreements((prev) => {
        const updated = { ...prev, [name]: !prev[name] };
        updated.all = updated.terms && updated.privacy && updated.marketing;
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    if (!agreements.terms) {
      termsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!agreements.privacy) {
      privacyRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!agreements.marketing) {
      marketingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
  };

  return (
    <motion.div
      className="sign-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold">회원가입</h1>

      <div className="h-full w-full max-w-2xl">
        <div className="text-lg font-semibold pb-4">약관 동의</div>
        <div className="bg-white border border-gray-300 rounded-md p-4 shadow-lg w-full h-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                className="rounded-full border-gray-400"
                checked={agreements.all}
                onCheckedChange={() => handleCheck("all")}
              />
              <div>
                <span className="font-bold text-base">전체 약관 동의</span>
              </div>
            </div>

            <div className="w-full h-0.5 bg-gray-300" />

            <div
              ref={termsRef}
              className="flex justify-between items-center *:text-sm"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  className="rounded-full border-gray-400"
                  checked={agreements.terms}
                  onCheckedChange={() => handleCheck("terms")}
                />
                <div>
                  <span className="text-violet-500 font-semibold">[필수]</span>
                  <span> 이용약관</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-3 py-0.5 border border-violet-500 text-violet-500 bg-white rounded-md font-bold">
                    내용보기
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>이용약관</DialogTitle>
                    <DialogDescription>
                      아래 내용을 확인 후 동의해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <p>이곳에 이용약관의 내용을 입력하세요...</p>
                </DialogContent>
              </Dialog>
            </div>

            <div
              ref={privacyRef}
              className="flex justify-between items-center *:text-sm"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  className="rounded-full border-gray-400"
                  checked={agreements.privacy}
                  onCheckedChange={() => handleCheck("privacy")}
                />
                <div>
                  <span className="text-violet-500 font-semibold">[필수]</span>
                  <span> 개인정보 수집·이용 동의</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-3 py-0.5 border border-violet-500 text-violet-500 bg-white rounded-md font-bold">
                    내용보기
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>개인정보 수집·이용 동의</DialogTitle>
                    <DialogDescription>
                      아래 내용을 확인 후 동의해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <p>이곳에 개인정보 수집·이용 동의 내용을 입력하세요...</p>
                </DialogContent>
              </Dialog>
            </div>

            <div
              ref={marketingRef}
              className="flex justify-between items-center *:text-sm"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  className="rounded-full border-gray-400"
                  checked={agreements.marketing}
                  onCheckedChange={() => handleCheck("marketing")}
                />
                <div>
                  <span className=" font-semibold">[선택]</span>
                  <span> 푸시 알림을 위한 개인정보 수집·이용 동의</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-3 py-0.5 border border-violet-500 text-violet-500 bg-white rounded-md font-bold">
                    내용보기
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      푸시 알림을 위한 개인정보 수집·이용 동의
                    </DialogTitle>
                    <DialogDescription>
                      아래 내용을 확인 후 동의해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    이곳에 푸시 알림을 위한 개인정보 수집·이용 동의의 내용을
                    입력하세요...
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="text-xs flex flex-col my-6 gap-2 text-gray-500">
          <span>
            ※ 필수항목에 동의하지 않으실 경우 서비스 가입이 불가합니다.
          </span>
          <span>
            ※ 선택항목에 동의하지 않으셔도 서비스 가입이 가능하지만, 관련
            서비스는 제공받을 수 없습니다.
          </span>
        </div>
      </div>

      <SignUpForm agreements={agreements} />
      <Link
        href="/auth/signin"
        className="underline text-blue-500 hover:text-blue-700"
      >
        로그인 하러가기
      </Link>
    </motion.div>
  );
};

export default SignUpPage;
