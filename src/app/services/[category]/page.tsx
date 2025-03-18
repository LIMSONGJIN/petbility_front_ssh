"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

export default function ServiceCategoryPage() {
  const { category } = useParams();

  // 서비스 카테고리별 콘텐츠 데이터 (그루밍 서비스 추가)
  const categories = {
    funeral: {
      name: "장례 서비스",
      description: "반려동물의 마지막을 존엄하게 보내는 맞춤형 장례 서비스",
      tagline:
        "여러분들의 반려동물에게 최고의 장례를 선사하세요. Petbility와 함께라면, 반려동물과의 마지막 순간이 특별한 시간이 될 것입니다. 지금 바로 Petbility의 프리미엄 장례 서비스를 경험해보세요!",
      items: [
        {
          title: "맞춤형 장례 서비스",
          description:
            "보호자의 요구에 맞춘 맞춤형 장례 진행. 다양한 장례 옵션 제공, 화장, 매장, 수목장 등.",
          image: "/images/funeral1.jpg",
        },
        {
          title: "전문적인 케어",
          description:
            "숙련된 장례 전문가가 전 과정 진행. 위생적이고 존중받는 환경에서의 시신 관리.",
          image: "/images/funeral2.jpg",
        },
        {
          title: "추모 용품 및 서비스",
          description:
            "유골함, 추모석, 장례용품 등 다양한 추모 상품 제공. 맞춤 제작 추모 앨범 및 영상 서비스.",
          image: "/images/funeral3.jpg",
        },
        {
          title: "환경 친화적 옵션",
          description:
            "생분해성 소재를 활용한 친환경 장례용품. 탄소 발자국을 줄이는 eco-friendly 장례 프로세스.",
          image: "/images/funeral4.jpg",
        },
        {
          title: "편리한 예약 및 진행",
          description:
            "온라인/모바일 앱을 통한 간편 예약 시스템. 장례 진행 상황 실시간 알림 서비스.",
          image: "/images/funeral5.jpg",
        },
        {
          title: "특별한 추모 이벤트",
          description:
            "계절별 특별 추모식 진행(봄꽃 추모제, 한가위 차례 등). 반려동물을 기리는 추모 콘서트 개최.",
          image: "/images/funeral6.jpg",
        },
      ],
    },
    grooming: {
      name: "그루밍 서비스",
      description:
        "반려동물의 건강과 스타일을 책임지는 종합적인 목욕 및 미용 서비스",
      tagline:
        "여러분들의 반려동물에게 최고의 스타일과 케어를 선사하세요. Petbility와 함께라면, 목욕과 미용 시간이 더욱 특별한 순간이 될 것입니다. 지금 바로 Petbility의 프리미엄 그루밍 서비스를 경험해보세요!",
      items: [
        {
          title: "맞춤형 그루밍 서비스",
          description:
            "반려동물의 특성에 맞춘 목욕과 미용 서비스를 제공합니다. 피부 상태와 털 유형에 따라 맞춤형 케어 적용.",
          image: "/images/grooming1.jpg",
        },
        {
          title: "투명한 서비스 제공",
          description:
            "서비스 전후 사진 및 동영상 제공으로 보호자에게 실시간 공유. 전문가의 상세한 케어 리포트 제공.",
          image: "/images/grooming2.jpg",
        },
        {
          title: "다양한 케어 옵션",
          description:
            "기본 목욕 및 미용 외에 추가 옵션 선택 가능: 발톱 관리, 귀 청소, 치아 관리, 피부 마사지.",
          image: "/images/grooming3.jpg",
        },
        {
          title: "프리미엄 스타일링",
          description:
            "반려동물의 종과 털 특성을 고려한 맞춤형 스타일링 제공. 최신 트렌드를 반영한 프리미엄 미용 서비스.",
          image: "/images/grooming4.jpg",
        },
        {
          title: "친환경 제품 사용",
          description:
            "동물과 환경에 무해한 천연 성분 샴푸 및 미용 제품 사용. 생분해성 타올과 도구로 환경 부담 최소화.",
          image: "/images/grooming5.jpg",
        },
        {
          title: "안전하고 위생적인 케어",
          description:
            "철저한 위생 관리로 감염 예방. 반려동물 전용 안전 장비와 전문가의 섬세한 케어.",
          image: "/images/grooming6.jpg",
        },
      ],
    },
  };

  const service = categories[category as keyof typeof categories];

  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">
          서비스를 찾을 수 없습니다.
        </h1>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        {service.name}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {service.description}
      </p>

      {/* 서비스 콘텐츠 (3x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {service.items.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative w-full h-56">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="opacity-90"
              />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        {/* 타이포그래픽 문구 */}
        <p className="typography">
          여러분들의 반려동물에게 최고의 장례를 선사하세요. <br />
          Petbility와 함께라면, 반려동물과의 마지막 순간이 <br /> 특별한 시간이
          될 것입니다.
          <br /> 지금 바로 Petbility의 프리미엄 장례 서비스를 경험해보세요!
        </p>
      </div>
    </section>
  );
}
