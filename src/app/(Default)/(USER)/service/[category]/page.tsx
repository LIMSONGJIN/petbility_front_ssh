"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { ServiceCategory } from "@/types/api";

export default function ServiceCategoryPage() {
  const { category } = useParams();

  const categories = {
    [ServiceCategory.FUNERAL]: {
      service_id: "9b851feb-d232-4117-a52a-5c0c5cc17ff4",
      name: "프리미엄 장례 서비스",
      description: "반려동물의 마지막을 존엄하게 보내는 맞춤형 장례 서비스",
      tagline:
        "여러분들의 반려동물에게 최고의 장례를 선사하세요. Petbility와 함께라면, 반려동물과의 마지막 순간이 특별한 시간이 될 것입니다. 지금 바로 Petbility의 프리미엄 장례 서비스를 경험해보세요!",
      items: [
        {
          title: "맞춤형 장례 서비스",
          description:
            "보호자의 요구에 맞춘 맞춤형 장례 진행. 다양한 장례 옵션 제공, 화장, 매장, 수목장 등.",
          image: "/services/funeral/funeral1.svg",
        },
        {
          title: "전문적인 케어",
          description:
            "숙련된 장례 전문가가 전 과정 진행. 위생적이고 존중받는 환경에서의 시신 관리.",
          image: "/services/funeral/funeral2.svg",
        },
        {
          title: "추모 용품 및 서비스",
          description:
            "유골함, 추모석, 장례용품 등 다양한 추모 상품 제공. 맞춤 제작 추모 앨범 및 영상 서비스.",
          image: "/services/funeral/funeral3.svg",
        },
        {
          title: "환경 친화적 옵션",
          description:
            "생분해성 소재를 활용한 친환경 장례용품. 탄소 발자국을 줄이는 eco-friendly 장례 프로세스.",
          image: "/services/funeral/funeral4.svg",
        },
        {
          title: "편리한 예약 및 진행",
          description:
            "온라인/모바일 앱을 통한 간편 예약 시스템. 장례 진행 상황 실시간 알림 서비스.",
          image: "/services/funeral/funeral5.svg",
        },
        {
          title: "특별한 추모 이벤트",
          description:
            "계절별 특별 추모식 진행(봄꽃 추모제, 한가위 차례 등). 반려동물을 기리는 추모 콘서트 개최.",
          image: "/services/funeral/funeral6.svg",
        },
      ],
    },
    [ServiceCategory.CREMATION]: {
      service_id: "7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
      name: "화장 서비스",
      description: "반려동물의 마지막을 정중하게 보내는 전문 화장 서비스",
      tagline:
        "반려동물의 마지막 여정을 존중하는 화장 서비스를 제공합니다. 전문적인 장비와 숙련된 인력으로 안전하고 정중한 화장을 진행합니다.",
      items: [
        {
          title: "개별 화장 서비스",
          description:
            "반려동물만을 위한 개별 화장 서비스. 다른 반려동물과 혼합되지 않는 프리미엄 화장 옵션.",
          image: "/services/cremation/cremation1.svg",
        },
        {
          title: "화장 후 케어",
          description:
            "화장 후 유골 보관 및 추모 서비스. 맞춤형 유골함 및 추모 상품 제공.",
          image: "/services/cremation/cremation2.svg",
        },
        {
          title: "화장 후 처리 옵션",
          description:
            "유골 분산, 수목장, 추모원 등 다양한 화장 후 처리 옵션 제공.",
          image: "/services/cremation/cremation3.svg",
        },
        {
          title: "화장 증명서 발급",
          description:
            "화장 진행 후 공식 증명서 발급. 법적 효력이 있는 화장 증명서 제공.",
          image: "/services/cremation/cremation4.svg",
        },
      ],
    },
    [ServiceCategory.GROOMING]: {
      name: "미용 서비스",
      service_id: "0a1f07bd-5c19-4f68-8c3e-822449545cd6",
      description: "반려동물의 건강과 스타일을 책임지는 종합적인 미용 서비스",
      tagline:
        "여러분들의 반려동물에게 최고의 스타일과 케어를 선사하세요. Petbility와 함께라면, 미용 시간이 더욱 특별한 순간이 될 것입니다. 지금 바로 Petbility의 프리미엄 그루밍 서비스를 경험해보세요!",
      items: [
        {
          title: "맞춤형 미용 서비스",
          description:
            "반려동물의 특성에 맞춘 미용 서비스를 제공합니다. 피부 상태와 털 유형에 따라 맞춤형 케어 적용.",
          image: "/services/grooming/grooming1.svg",
        },
        {
          title: "투명한 서비스 제공",
          description:
            "서비스 전후 사진 및 동영상 제공으로 보호자에게 실시간 공유. 전문가의 상세한 케어 리포트 제공.",
          image: "/services/grooming/grooming2.svg",
        },
        {
          title: "다양한 케어 옵션",
          description:
            "기본 미용 외에 추가 옵션 선택 가능: 발톱 관리, 귀 청소, 치아 관리, 피부 마사지.",
          image: "/services/grooming/grooming3.svg",
        },
        {
          title: "프리미엄 스타일링",
          description:
            "반려동물의 종과 털 특성을 고려한 맞춤형 스타일링 제공. 최신 트렌드를 반영한 프리미엄 미용 서비스.",
          image: "/services/grooming/grooming4.svg",
        },
        {
          title: "친환경 제품 사용",
          description:
            "동물과 환경에 무해한 천연 성분 미용 제품 사용. 생분해성 타올과 도구로 환경 부담 최소화.",
          image: "/services/grooming/grooming5.svg",
        },
        {
          title: "안전하고 위생적인 케어",
          description:
            "철저한 위생 관리로 감염 예방. 반려동물 전용 안전 장비와 전문가의 섬세한 케어.",
          image: "/services/grooming/grooming6.svg",
        },
      ],
    },
    [ServiceCategory.BATHING]: {
      name: "목욕 서비스",
      service_id: "3d4e5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s",
      description: "반려동물의 건강과 위생을 위한 전문 목욕 서비스",
      tagline:
        "반려동물의 건강과 위생을 위한 전문 목욕 서비스를 제공합니다. 피부 상태에 맞는 맞춤형 목욕으로 반려동물의 건강을 챙겨드립니다.",
      items: [
        {
          title: "맞춤형 목욕 서비스",
          description:
            "반려동물의 피부 상태와 털 유형에 맞는 맞춤형 목욕 서비스. 민감한 피부를 위한 특별 케어.",
          image: "/services/bathing/bathing1.svg",
        },
        {
          title: "피부 건강 케어",
          description:
            "피부 상태에 맞는 전문 샴푸와 컨디셔너 사용. 건조한 피부, 민감한 피부, 알레르기 있는 반려동물을 위한 특별 케어.",
          image: "/services/bathing/bathing2.svg",
        },
        {
          title: "털 관리 및 브러싱",
          description:
            "목욕 전후 전문적인 털 관리 및 브러싱. 매트 방지 및 털 건강 증진을 위한 케어.",
          image: "/services/bathing/bathing3.svg",
        },
        {
          title: "목욕 후 스타일링",
          description:
            "목욕 후 전문적인 드라이 및 스타일링. 반려동물의 종과 털 특성에 맞는 스타일링 제공.",
          image: "/services/bathing/bathing4.svg",
        },
        {
          title: "목욕 후 케어 리포트",
          description:
            "목욕 후 피부 상태 및 털 건강에 대한 전문가 리포트 제공. 향후 케어를 위한 맞춤형 조언.",
          image: "/services/bathing/bathing5.svg",
        },
      ],
    },
    [ServiceCategory.CUSTOM_VEHICLES]: {
      name: "맞춤형 차량 제작 서비스",
      service_id: "c2cb753f-1225-426e-9980-d700085dc719",
      description: "장례 및 미용 목적에 특화된 반려동물 전용 맞춤 차량 제작",
      tagline:
        "업계 최초! 반려동물을 위한 전용 이동 수단을 설계해드립니다. Petbility만의 독보적인 차량 솔루션으로 이동 중에도 편안하고 안전하게 케어하세요.",
      items: [
        {
          title: "장례/화장 전용 차량",
          description:
            "엄숙한 분위기와 기능성을 모두 고려한 장례용 맞춤 차량. 이동 중에도 반려동물의 마지막 여정을 존중합니다.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "미용/목욕 전용 차량",
          description:
            "이동식 미용 및 목욕 서비스에 최적화된 차량 설계. 내부 물 공급, 환기 시스템, 전문 장비 완비.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "응급 케어 전용 차량",
          description:
            "응급 상황에 대비한 의료 장비가 완비된 이동식 케어 차량. 전문 의료진이 탑승 가능한 구조.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "맞춤형 인테리어",
          description:
            "반려동물의 크기와 특성에 맞는 맞춤형 인테리어. 안전하고 편안한 이동을 위한 특수 설계.",
          image: "https://placehold.co/300x300",
        },
      ],
    },
    [ServiceCategory.OTHER_CARE]: {
      name: "기타 반려동물 케어 서비스",
      service_id: "ececa9ba-3257-4338-87c5-4d3d03bd6bde",
      description: "일상 속에서 필요한 다양한 반려동물 케어 서비스 제공",
      tagline:
        "단순한 관리가 아닌, 사랑과 세심함이 담긴 케어. Petbility는 반려동물의 삶의 질 향상을 위한 다양한 서비스를 제공합니다.",
      items: [
        {
          title: "영양관리 & 건강 코칭",
          description:
            "전문가의 컨설팅을 통한 맞춤형 식단 제안 및 건강 관리 플랜 제공.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "심리 안정 프로그램",
          description:
            "불안 행동 완화, 사회성 향상, 정서적 교감을 위한 전문 케어 프로그램.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "노령견 케어",
          description:
            "노령견을 위한 특별 케어 프로그램. 관절 건강, 인지 기능 향상을 위한 맞춤형 케어.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "재활 및 물리치료",
          description:
            "수술 후 재활 및 만성 질환 관리를 위한 물리치료 서비스. 전문 치료사가 진행하는 맞춤형 재활 프로그램.",
          image: "https://placehold.co/300x300",
        },
        {
          title: "반려동물 호텔링",
          description:
            "보호자가 부재 중일 때 반려동물을 위한 프리미엄 호텔링 서비스. 24시간 전문 케어와 모니터링.",
          image: "https://placehold.co/300x300",
        },
      ],
    },
  };

  const service = categories[category as keyof typeof categories];

  if (!service) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-500">
          서비스를 찾을 수 없습니다.
        </h1>
      </div>
    );
  }

  return (
    <>
      <section className="container mx-auto px-6 py-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {service.name}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {service.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center ">
          {service.items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 group max-w-[290px]"
            >
              <div className="relative w-full h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover scale-105 transition-transform duration-300"
                />
              </div>
              <div className="bg-white p-5 h-fit flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-violet-100 via-white to-violet-50 border border-violet-200 p-8 rounded-xl text-center shadow-md">
          <p className="text-lg md:text-xl font-semibold text-violet-800 leading-relaxed">
            {service.tagline}
          </p>
        </div>

        <div className="mt-16 bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            가격이 궁금하신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            서비스에 따라 가격이 상이할 수 있습니다. 정확한 견적은 예약 요청
            또는 전화 문의를 통해 확인해주세요.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href={`/reservation/${service.service_id}`}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              예약하러 가기
            </Link>

            <a
              href="tel:1800-1234"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-3 rounded-lg transition"
            >
              <PhoneCall className="w-5 h-5" /> 전화 문의
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
