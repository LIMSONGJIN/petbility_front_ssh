"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  PackageCheck,
  CalendarCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BusinessDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#122358]">사업자 대시보드</h1>

      {/* 상단 카드: 프로필, 예약 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 내 프로필 */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Image
              src="/default-avatar.svg"
              alt="profile"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-lg">홍길동</p>
              <p className="text-gray-500 text-sm">반려동물 장례업체 대표</p>
              <Button variant="outline" className="mt-2 text-xs px-3 py-1">
                내 정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 예약 수 */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">오늘 예약 수</p>
              <CalendarCheck size={20} />
            </div>
            <p className="text-2xl font-bold text-[#122358]">3건</p>
            <p className="text-sm text-gray-500">대기 1 · 확정 2</p>
            <Link href="/business/services">Service</Link>
          </CardContent>
        </Card>

        {/* 오늘 매출 */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">오늘 매출</p>
              <BarChart size={20} />
            </div>
            <p className="text-2xl font-bold text-[#122358]">₩340,000</p>
            <p className="text-sm text-gray-500">총 2건 결제 완료</p>
          </CardContent>
        </Card>
      </div>

      {/* 하단: 그래프 + 빠른 액션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 월별 매출 그래프 (예시) */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">최근 7일 매출</p>
              <LineChart size={20} />
            </div>
            <div className="h-40 flex items-center justify-center text-gray-400">
              {/* 여기에 차트 라이브러리 삽입 (recharts 등) */}
              <span>📈 매출 그래프 예정</span>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 액션 */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">서비스 관리</p>
                <PackageCheck size={20} />
              </div>
              <Button className="mt-2 w-full" variant="default">
                서비스 등록하기
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">후기 평점</p>
                <Star size={20} />
              </div>
              <p className="text-lg font-bold text-yellow-500 mt-2">
                4.8 / 5.0
              </p>
              <p className="text-sm text-gray-500">누적 리뷰 41건</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
