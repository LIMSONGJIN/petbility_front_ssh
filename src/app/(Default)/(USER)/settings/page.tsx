import { SettingsForm } from "@/components/Forms/SettingsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정 | 마케팅 최적화 서비스",
  description: "사용자 계정 설정",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">계정 설정</h1>
        <p className="mt-2 text-gray-600">계정 설정을 관리하세요.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
