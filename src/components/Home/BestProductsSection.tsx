"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { products } from "@/data/service";

// DB 구조 반영된 상품 데이터
const bestProducts = products;

export default function BestProductsSection() {
  const settings = {
    dots: true, // 도트 네비게이션 표시
    infinite: true, // 무한 루프
    speed: 500, // 전환 속도
    slidesToShow: 4, // 한 번에 보여질 상품 개수
    slidesToScroll: 1, // 한 번에 넘어가는 개수
    autoplay: true, // 자동 슬라이드
    autoplaySpeed: 3000, // 자동 전환 속도 (3초)
    responsive: [
      {
        breakpoint: 1024, // 태블릿
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768, // 모바일
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section className="container mx-auto py-12 px-8 w-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        쇼핑몰 베스트 상품
      </h2>
      <p className="text-center text-gray-600 mb-12">
        많은 보호자들이 사랑하는 인기 상품들을 만나보세요.
      </p>

      {/* Slick 슬라이더 */}
      <Slider {...settings}>
        {bestProducts.map((product) => (
          <div key={product.product_id} className="px-2">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition">
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-violet-600">
                  {product.price.toLocaleString()}원
                </span>
                <span className="text-sm text-gray-500">
                  재고: {product.stock}개
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="flex items-center text-gray-500">
                  <Heart className="text-red-500" size={18} />
                  <span className="ml-1">{product.like}</span>
                </span>
                <Link
                  href={`/shop/${product.product_id}`}
                  className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
                >
                  상품 보기
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
