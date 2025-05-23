import { ProfileForm } from "@/components/Forms/ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필 | 마케팅 최적화 서비스",
  description: "사용자 프로필 정보 관리",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">내 프로필</h1>
        <p className="mt-2 text-gray-600">프로필 정보를 관리하세요.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
