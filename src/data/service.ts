const serviceList = [
  {
    service_id: "1",
    business_id: "biz-1",
    name: "프리미엄 장례 서비스",
    description: "반려동물의 마지막을 존중하며 보내는 장례 서비스입니다.",
    price: 200000,
    duration: 90,
    available_time: ["09:00-12:00", "14:00-18:00"],
    location: "서울 강남구",
    latitude: 37.4979,
    longitude: 127.0276,
    category: "funeral",
    avg_rating: 4.8,
    review_count: 120,
    likes: 320,
    pending_count: 5,
    confirmed_count: 40,
    canceled_count: 2,
    created_at: "2024-03-14T10:00:00Z",
    updated_at: "2024-03-14T12:00:00Z",
  },
  {
    service_id: "2",
    business_id: "biz-2",
    name: "고급 반려동물 목욕 서비스",
    description: "전문 스파 트리트먼트로 건강한 피부와 모발을 유지하세요.",
    price: 50000,
    duration: 60,
    available_time: ["10:00-14:00", "16:00-20:00"],
    location: "서울 마포구",
    latitude: 37.5568,
    longitude: 126.9104,
    category: "bathing",
    avg_rating: 4.5,
    review_count: 85,
    likes: 210,
    pending_count: 3,
    confirmed_count: 30,
    canceled_count: 1,
    created_at: "2024-03-12T08:30:00Z",
    updated_at: "2024-03-12T11:45:00Z",
  },
  {
    service_id: "3",
    business_id: "biz-3",
    name: "프리미엄 미용 서비스",
    description: "반려동물을 위한 맞춤 스타일링과 털 관리 서비스.",
    price: 70000,
    duration: 75,
    available_time: ["09:00-15:00"],
    location: "서울 종로구",
    latitude: 37.5704,
    longitude: 126.986,
    category: "grooming",
    avg_rating: 4.7,
    review_count: 95,
    likes: 250,
    pending_count: 6,
    confirmed_count: 25,
    canceled_count: 0,
    created_at: "2024-03-10T14:00:00Z",
    updated_at: "2024-03-10T15:30:00Z",
  },
];

const memorialPosts = [
  {
    post_id: "1",
    user_id: "user-101",
    title: "사랑하는 우리 강아지 루루를 기억하며",
    content: "우리 루루가 무지개 다리를 건넌 지 1년이 되었어요...",
    image_url: "/dog1.jpg",
    likes: 120,
    comments_count: 30,
    views: 540,
    report_count: 0,
    is_published: true,
    created_at: "2024-03-10T14:00:00Z",
  },
  {
    post_id: "2",
    user_id: "user-102",
    title: "15년을 함께한 우리 고양이 나비야",
    content: "나비가 떠난 후에도 매일 나비 생각이 납니다...",
    image_url: "/dog2.jpg",
    likes: 98,
    comments_count: 22,
    views: 430,
    report_count: 0,
    is_published: true,
    created_at: "2024-03-12T16:30:00Z",
  },
  {
    post_id: "3",
    user_id: "user-103",
    title: "무지개 다리를 건넌 우리 가족 댕댕이",
    content: "떠난 지 얼마 안 됐지만, 항상 기억할게...",
    image_url: "/dog3.jpg",
    likes: 75,
    comments_count: 18,
    views: 320,
    report_count: 0,
    is_published: true,
    created_at: "2024-03-14T10:15:00Z",
  },
];

const bestProducts = [
  {
    product_id: "1",
    name: "프리미엄 강아지 사료",
    description: "강아지의 건강을 위한 최고급 사료",
    original_price: 39000,
    discount_price: 35000,
    delivery_fee: 3000,
    stock: 20,
    like: 150,
    category: "사료",
    image_url: "/products/product_1.png",
    created_at: "2024-03-14T10:00:00Z",
  },
  {
    product_id: "2",
    name: "고양이 장난감 세트",
    description: "고양이가 좋아하는 다양한 장난감 세트",
    original_price: 20000,
    discount_price: 18000,
    delivery_fee: 3000,
    stock: 15,
    like: 120,
    category: "장난감",
    image_url: "/products/product_2.png",
    created_at: "2024-03-14T11:00:00Z",
  },
  {
    product_id: "3",
    name: "강아지 이동가방",
    description: "외출 시 편리한 반려동물 이동가방",
    original_price: 49000,
    discount_price: 45000,
    delivery_fee: 3000,
    stock: 10,
    like: 95,
    category: "용품",
    image_url: "/products/product_3.png",
    created_at: "2024-03-14T12:00:00Z",
  },
  {
    product_id: "4",
    name: "고양이 자동 화장실",
    description: "청결 유지가 쉬운 스마트 자동 화장실",
    original_price: 125000,
    discount_price: 100000,
    delivery_fee: 3000,
    stock: 5,
    like: 80,
    category: "용품",
    image_url: "/products/product_4.png",
    created_at: "2024-03-14T13:00:00Z",
  },
  {
    product_id: "5",
    name: "강아지 껌 세트",
    description: "치석 제거에 좋은 천연 강아지 껌",
    original_price: 12000,
    discount_price: 0,
    delivery_fee: 3000,
    stock: 50,
    like: 65,
    category: "간식",
    image_url: "/products/product_5.png",
    created_at: "2024-03-14T14:00:00Z",
  },
  {
    product_id: "6",
    name: "고양이 캣타워",
    description: "튼튼하고 실용적인 고양이 전용 캣타워",
    original_price: 99000,
    discount_price: 0,
    delivery_fee: 3000,
    stock: 8,
    like: 110,
    category: "용품",
    image_url: "/products/product_6.png",
    created_at: "2024-03-14T15:00:00Z",
  },
];

const availableTimes = ["09:00", "10:00", "11:00", "14:00", "16:00", "18:00"];

const reservationsList = [
  {
    service_id: "1",
    name: "반려동물 장례 서비스",
    business_id: "biz-101",
  },
  {
    service_id: "2",
    name: "프리미엄 목욕 서비스",
    business_id: "biz-102",
  },
  {
    service_id: "3",
    name: "반려동물 미용 서비스",
    business_id: "biz-103",
  },
];

const pets = [
  {
    pet_id: "p1",
    name: "루루",
    type: "강아지",
  },
  {
    pet_id: "p2",
    name: "나비",
    type: "고양이",
  },
];

const reviews = [
  {
    review_id: "1",
    user_id: "user-101",
    service_id: "1",
    product_id: null,
    rating: 5,
    comment:
      "정말 감동적인 장례 서비스였습니다. 끝까지 배려해주셔서 감사합니다.",
    photo_url: "/default-avatar.svg",
    likes: 120,
    created_at: "2024-03-12T10:00:00Z",
  },
  {
    review_id: "2",
    user_id: "user-102",
    service_id: null,
    product_id: "2",
    rating: 4,
    comment:
      "고양이 장난감 세트 너무 좋아요! 우리 고양이가 아주 잘 가지고 놉니다.",
    photo_url: "/default-avatar.svg",
    likes: 98,
    created_at: "2024-03-13T11:00:00Z",
  },
  {
    review_id: "3",
    user_id: "user-103",
    service_id: "2",
    product_id: null,
    rating: 5,
    comment: "목욕 서비스 완전 강추! 반려견이 스트레스 없이 깨끗해졌어요!",
    photo_url: "/default-avatar.svg",
    likes: 85,
    created_at: "2024-03-14T12:00:00Z",
  },
  {
    review_id: "4",
    user_id: "user-104",
    service_id: null,
    product_id: "4",
    rating: 3,
    comment: "고양이 자동 화장실 편리하지만 조금 크기가 커서 공간이 필요해요.",
    photo_url: "/default-avatar.svg",
    likes: 65,
    created_at: "2024-03-15T13:00:00Z",
  },
  {
    review_id: "5",
    user_id: "user-105",
    service_id: "3",
    product_id: null,
    rating: 5,
    comment: "미용 서비스 완전 만족! 우리 강아지가 너무 귀엽게 변신했어요!",
    photo_url: "/default-avatar.svg",
    likes: 140,
    created_at: "2024-03-16T14:00:00Z",
  },
  {
    review_id: "6",
    user_id: "user-106",
    service_id: null,
    product_id: "6",
    rating: 4,
    comment: "캣타워 좋아요! 튼튼하고 디자인도 예뻐요.",
    photo_url: "/default-avatar.svg",
    likes: 90,
    created_at: "2024-03-17T15:00:00Z",
  },
];

export const comments = [
  {
    comment_id: "1",
    post_id: "1",
    user_id: "user-201",
    content: "루루가 좋은 곳에서 행복하길 바라요 😢",
    likes: 15,
    report_count: 0,
    created_at: "2024-03-11T10:00:00Z",
  },
  {
    comment_id: "2",
    post_id: "1",
    user_id: "user-202",
    content: "저도 반려견을 떠나보냈는데... 공감됩니다 🐶",
    likes: 12,
    report_count: 0,
    created_at: "2024-03-11T12:00:00Z",
  },
];

export const services = serviceList;
export const memorials = memorialPosts;
export const products = bestProducts;
export const reservations = reservationsList;
export const times = availableTimes;
export const petsList = pets;
export const reviewsList = reviews;

// 예약 관련 목업 데이터
export const mockReservationData = {
  // 사용자 주소 정보
  userAddress: {
    address: "서울특별시 강남구 테헤란로 123",
    latitude: 37.4979,
    longitude: 127.0276,
  },

  // 가능한 시간대 (오전/오후)
  availableTimeSlots: {
    morning: ["09:00", "10:00", "11:00", "12:00"],
    afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  },

  // 서비스 가격 정보
  servicePrices: {
    funeral: 200000,
    cremation: 150000,
    grooming: 50000,
    bathing: 30000,
    custom_vehicles: 100000,
    other_care: 40000,
  },

  // 반려동물 목록
  pets: [
    {
      id: "322db1b2-585e-4539-be94-ed31d8d3dc32",
      name: "루루",
      type: "강아지",
      breed: "골든 리트리버",
      age: 3,
      image: "https://placehold.co/300x300",
    },
    {
      id: "322db1b2-585e-4539-be94-ed31d8d3dc31",
      name: "나비",
      type: "고양이",
      breed: "페르시안",
      age: 2,
      image: "https://placehold.co/300x300",
    },
  ],

  // 예약 단계 정보
  reservationSteps: [
    { id: 1, title: "주소 확인", description: "서비스 제공 지역 확인" },
    {
      id: 2,
      title: "날짜 및 시간 선택",
      description: "예약 가능한 날짜와 시간 선택",
    },
    {
      id: 3,
      title: "반려동물 선택",
      description: "서비스를 받을 반려동물 선택",
    },
    { id: 4, title: "메모 및 결제", description: "특이사항 입력 및 결제" },
    {
      id: 5,
      title: "예약 완료",
      description: "예약이 성공적으로 완료되었습니다",
    },
  ],
};

export { serviceList, memorialPosts, bestProducts };
