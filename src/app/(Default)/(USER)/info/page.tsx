import Image from "next/image";

export default function Info() {
  return (
    <div className="py-8">
      {/* 회사 소개 섹션 */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            펫빌리티 소개
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            반려동물과 함께하는 더 나은 삶을 위한 혁신적인 서비스를 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://placehold.co/600x400"
              alt="펫빌리티 회사 이미지"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">회사 개요</h2>
            <p className="text-gray-600 mb-4">
              펫빌리티는 2023년에 설립된 반려동물 서비스 전문 기업입니다.
              반려동물의 삶의 질 향상과 보호자의 편의성을 최우선으로 생각하며,
              혁신적인 서비스와 솔루션을 제공하고 있습니다.
            </p>
            <p className="text-gray-600">
              장례, 미용, 목욕, 맞춤형 차량 제작 등 다양한 서비스를 통해
              반려동물과 보호자 모두에게 최상의 경험을 제공하는 것을 목표로 하고
              있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 인사말 섹션 */}
      <section className="mb-16 bg-gray-50 py-12 px-6 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            인사말
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="https://placehold.co/300x300"
                alt="대표이사 이미지"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                홍길동 대표이사
              </h3>
              <p className="text-gray-600 mb-4">
                안녕하세요, 펫빌리티 대표이사 홍길동입니다.
              </p>
              <p className="text-gray-600 mb-4">
                저는 오랜 기간 반려동물 산업에 종사하며, 반려동물과 보호자
                모두의 니즈를 깊이 이해하게 되었습니다. 특히 반려동물의 마지막을
                보내는 과정에서 많은 보호자들이 겪는 어려움을 목격하며, 이에
                대한 전문적인 서비스의 필요성을 절감했습니다.
              </p>
              <p className="text-gray-600">
                펫빌리티는 이러한 경험을 바탕으로 설립되었으며, 반려동물의
                존엄한 마지막을 보장하고, 보호자에게 위로와 편안함을 제공하는
                것을 사명으로 삼고 있습니다. 앞으로도 펫빌리티는 반려동물과
                보호자 모두에게 최상의 서비스를 제공하기 위해 끊임없이
                노력하겠습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 비전 섹션 */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">회사 비전</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            반려동물과 보호자 모두에게 행복한 삶을 제공하는 글로벌 리더
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-violet-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              존엄한 마지막
            </h3>
            <p className="text-gray-600">
              반려동물의 마지막 순간을 존엄하게 보내는 서비스를 제공하여
              보호자에게 위로와 편안함을 드립니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-violet-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              건강한 삶
            </h3>
            <p className="text-gray-600">
              반려동물의 건강과 행복을 위한 다양한 케어 서비스를 제공하여 더
              나은 삶의 질을 제공합니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-violet-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              혁신적인 서비스
            </h3>
            <p className="text-gray-600">
              기술과 서비스를 결합한 혁신적인 솔루션을 통해 반려동물 산업의
              새로운 패러다임을 제시합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 경영 방침 섹션 */}
      <section className="mb-16 bg-gray-50 py-12 px-6 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            경영 방침
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  고객 중심
                </h3>
                <p className="text-gray-600">
                  모든 서비스는 반려동물과 보호자의 니즈를 최우선으로
                  고려합니다. 고객의 피드백을 적극적으로 수렴하여 지속적으로
                  서비스를 개선합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  전문성
                </h3>
                <p className="text-gray-600">
                  모든 서비스는 전문적인 지식과 경험을 갖춘 인력에 의해
                  제공됩니다. 지속적인 교육과 훈련을 통해 서비스의 품질을
                  유지합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  투명성
                </h3>
                <p className="text-gray-600">
                  모든 서비스 과정은 투명하게 진행되며, 보호자에게 실시간으로
                  진행 상황을 공유합니다. 가격과 서비스 내용에 대한 명확한
                  정보를 제공합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  환경 책임
                </h3>
                <p className="text-gray-600">
                  환경을 고려한 친환경 서비스를 제공합니다. 지속 가능한 자원
                  사용과 환경 보호를 위한 노력을 지속합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 인재상 섹션 */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">인재상</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            펫빌리티가 추구하는 인재상은 다음과 같습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-violet-600">P</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Passion (열정)
              </h3>
            </div>
            <p className="text-gray-600">
              반려동물과 보호자에 대한 진정한 사랑과 열정을 가진 인재를
              추구합니다. 일에 대한 열정과 책임감을 가지고 최선을 다하는 자세가
              중요합니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-violet-600">E</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Expertise (전문성)
              </h3>
            </div>
            <p className="text-gray-600">
              반려동물 서비스에 대한 전문적인 지식과 기술을 갖춘 인재를
              추구합니다. 지속적인 학습과 자기 개발을 통해 전문성을 높이는
              자세가 중요합니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-violet-600">T</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Trust (신뢰)
              </h3>
            </div>
            <p className="text-gray-600">
              고객과 동료에 대한 신뢰를 바탕으로 일하는 인재를 추구합니다.
              정직하고 성실한 태도로 신뢰를 쌓는 자세가 중요합니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-violet-600">B</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Balance (균형)
              </h3>
            </div>
            <p className="text-gray-600">
              업무와 삶의 균형을 잘 유지하는 인재를 추구합니다. 건강한 신체와
              정신을 바탕으로 지속 가능한 성과를 내는 자세가 중요합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
