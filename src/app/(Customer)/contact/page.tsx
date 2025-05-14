"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API 호출을 여기에 구현할 수 있습니다
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시: API 호출 시뮬레이션
      toast.success(
        "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-gray-100 rounded-full"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">연락처</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* 연락처 정보 */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              펫빌리티에 연락하세요
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">전화번호</h3>
                  <p className="text-gray-600 mt-1">고객센터: 1234-5678</p>
                  <p className="text-gray-600">비즈니스: 1234-5679</p>
                  <p className="text-sm text-gray-500 mt-1">
                    평일 09:00 - 18:00 (공휴일 제외)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">이메일</h3>
                  <p className="text-gray-600 mt-1">
                    고객지원: support@petbility.com
                  </p>
                  <p className="text-gray-600">
                    제휴문의: business@petbility.com
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    24시간 접수 가능, 영업일 기준 1일 이내 답변
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">주소</h3>
                  <p className="text-gray-600 mt-1">
                    서울특별시 강남구 테헤란로 123
                  </p>
                  <p className="text-gray-600">펫빌리티 타워 5층</p>
                  <p className="text-sm text-gray-500 mt-1">
                    지하철 2호선 강남역 3번 출구에서 도보 5분
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">업무시간</h3>
                  <p className="text-gray-600 mt-1">평일: 09:00 - 18:00</p>
                  <p className="text-gray-600">토요일, 일요일, 공휴일 휴무</p>
                  <p className="text-sm text-gray-500 mt-1">
                    점심시간: 12:00 - 13:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 문의 양식 */}
          <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">문의하기</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    이름 *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해주세요"
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    이메일 *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력해주세요"
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="전화번호를 입력해주세요"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700">
                    제목 *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="문의 제목을 입력해주세요"
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700">
                  메시지 *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="문의 내용을 자세히 입력해주세요"
                  required
                  rows={6}
                  className="border-gray-300 resize-none"
                />
              </div>

              <div className="text-sm text-gray-500">
                * 필수 입력 항목입니다.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    전송 중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> 문의 전송하기
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* 지도 (실제 구현에서는 Google Maps, Kakao Maps 등 API를 연동할 수 있습니다) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">오시는 길</h2>
          <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">지도가 표시될 영역입니다.</p>
          </div>
          <div className="mt-4 text-gray-600">
            <p className="font-semibold">대중교통 이용 안내</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>지하철: 2호선 강남역 3번 출구에서 도보 5분</li>
              <li>
                버스: 강남역 정류장 하차 (간선: 145, 146, 301, 지선: 3412, 4412)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
