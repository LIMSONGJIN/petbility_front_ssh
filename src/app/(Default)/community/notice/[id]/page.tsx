"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

// 임시 공지사항 상세 데이터
const mockNoticeDetail = {
  id: "1",
  title: "서비스 이용 안내",
  content: `안녕하세요, Petbility입니다.

새로운 서비스 이용 방법에 대한 안내드립니다.

1. 서비스 예약 방법
- 홈페이지 또는 모바일 앱을 통해 예약 가능
- 원하는 서비스와 날짜/시간 선택
- 반려동물 정보 입력
- 결제 완료

2. 주의사항
- 예약 변경은 최소 24시간 전에 가능
- 취소 시 수수료가 발생할 수 있음
- 서비스 이용 시 반려동물의 건강 상태를 확인해주세요

3. 문의사항
- 고객센터: 1800-1234
- 이메일: support@petbility.com
- 운영시간: 평일 09:00-18:00

감사합니다.`,
  date: "2024-03-15",
  author: "관리자",
  views: 120,
  isImportant: true,
  category: "공지",
};

export default function NoticeDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로</span>
        </button>

        {/* 공지사항 상세 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {mockNoticeDetail.isImportant && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  중요
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {mockNoticeDetail.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {mockNoticeDetail.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{mockNoticeDetail.author}</span>
              <span>{mockNoticeDetail.date}</span>
              <span>조회수 {mockNoticeDetail.views}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700">
              {mockNoticeDetail.content}
            </pre>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Share2 className="w-5 h-5" />
              <span>공유하기</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Bookmark className="w-5 h-5" />
              <span>북마크</span>
            </button>
          </div>
        </motion.div>

        {/* 관련 공지사항 */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            관련 공지사항
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Link
                key={item}
                href={`/community/notice/${item}`}
                className="block p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-gray-800 font-medium">
                  관련 공지사항 제목 {item}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  2024-03-{15 - item} | 조회수 {120 - item * 10}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
