export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "funeral",
    name: "장례 서비스",
    description:
      "반려동물 장례 서비스 (화장, 매장, 납골, 장례식 등 프리미엄 서비스)",
  },
  {
    id: "cremation",
    name: "화장 서비스",
    description: "반려동물 화장 서비스 (단순 화장 및 납골)",
  },
  {
    id: "grooming",
    name: "미용 서비스",
    description: "반려동물 미용 서비스 (컷, 스타일링, 네일 등)",
  },
  {
    id: "bathing",
    name: "목욕 서비스",
    description: "반려동물 목욕 서비스 (샴푸, 스파, 스킨케어 등)",
  },
  {
    id: "custom-vehicles",
    name: "차량 제작",
    description: "반려동물 장례용 차량 제작 서비스",
  },
  {
    id: "other-care",
    name: "기타 케어",
    description: "기타 반려동물 케어 서비스",
  },
];
