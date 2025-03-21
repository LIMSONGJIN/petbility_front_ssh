"use client";

import { useParams } from "next/navigation";
import { products, reviewsList } from "@/data/service";
import Image from "next/image";
import { Heart, ShoppingCart, Star, StarOff } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { product_id } = useParams();
  const product = products.find((p) => p.product_id === product_id);
  const related = products.filter(
    (p) => p.category === product?.category && p.product_id !== product_id
  );
  const reviews = reviewsList.filter((r) => r.product_id === product_id);

  const [likes, setLikes] = useState(product?.like || 0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");

  if (!product) {
    return (
      <div className="text-center py-12 text-red-500 font-bold">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  const ratingAvg =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, score) => {
    acc[score] = reviews.filter((r) => r.rating === score).length;
    return acc;
  }, {} as Record<number, number>);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <Star key={i} className="text-yellow-400" size={20} />
        ) : (
          <StarOff key={i} className="text-gray-300" size={20} />
        )
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const priceToUse =
    product.discount_price && product.discount_price > 0
      ? product.discount_price
      : product.original_price;

  const totalPrice = priceToUse * quantity;
  const isFreeShipping = priceToUse >= 30000;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="container mx-auto px-4 py-10 flex flex-col w-full items-center gap-8"
    >
      {/* 상단 정보 */}
      <div className="flex gap-10 items-start w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-4 overflow-hidden"
        >
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="w-full max-w-[300px] h-auto object-contain rounded-lg overflow-hidden"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 flex-1"
        >
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <div className="flex w-full justify-between items-center">
            {ratingAvg === "0" ? (
              <div className="text-sm text-gray-500">상품 후기가 없습니다.</div>
            ) : (
              <div className="flex items-center gap-2">
                {renderStars(Number(ratingAvg))}
              </div>
            )}
            <button
              className="bg-white rounded-full p-1 w-fit hover:scale-105 transition"
              onClick={() => setLikes((prev) => prev + 1)}
            >
              <Heart className=" text-rose-500" size={16} />
            </button>
          </div>
          {/* 가격 영역 */}
          {product.discount_price && product.discount_price > 0 ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400 line-through">
                {product.original_price.toLocaleString()}원
              </p>
              <p className="text-xl font-bold text-violet-600">
                {product.discount_price.toLocaleString()}원
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-violet-600">
              {product.original_price.toLocaleString()}원
            </p>
          )}

          <p className="text-sm text-gray-500">재고: {product.stock}개</p>

          <p className="text-sm text-gray-500">
            배송비:{" "}
            {isFreeShipping ? (
              <span className="text-green-600 font-semibold">무료배송</span>
            ) : (
              `${product.delivery_fee.toLocaleString()}원`
            )}
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex items-center border rounded px-2 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2"
              >
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2"
              >
                +
              </button>
            </div>
            {product.stock <= 5 && (
              <span className="text-xs text-red-500">
                재고가 {product.stock}개 남았습니다.
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700">
            총 상품 금액:{" "}
            <span className="font-bold text-gray-900">
              {totalPrice.toLocaleString()}원
            </span>
          </p>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition">
              구매하기
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition">
              <ShoppingCart size={16} className="inline mr-1" /> 장바구니
            </button>
          </div>
        </motion.div>
      </div>

      {/* 연관 상품 */}
      {related.length > 0 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 연관 상품</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((item) => {
              const finalPrice =
                item.discount_price && item.discount_price > 0
                  ? item.discount_price
                  : item.original_price;
              return (
                <div
                  key={item.product_id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-40 object-contain mb-2"
                  />
                  <h4 className="font-bold text-gray-800 text-base mb-1">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {finalPrice.toLocaleString()}원
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 탭 메뉴 */}
      <div className="flex gap-6 text-sm font-semibold border-b w-full max-w-4xl justify-around">
        {[
          { key: "info", label: "상품 정보" },
          { key: "review", label: "상품 후기" },
          { key: "qna", label: "상품 문의" },
          { key: "notice", label: "구매 확인사항" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 ${
              activeTab === tab.key
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="w-full max-w-4xl">
        {activeTab === "info" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              📝 상세 설명
            </h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg">
              {product.description} (이 곳에 더 많은 설명이 들어갈 수 있어요.)
            </p>
          </div>
        )}

        {activeTab === "review" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💬 상품 리뷰
            </h3>
            {ratingAvg === "0" ? (
              <div className="text-sm text-gray-500">상품 후기가 없습니다.</div>
            ) : (
              reviews.slice(0, 5).map((review) => (
                <div
                  key={review.review_id}
                  className="bg-white p-4 border rounded-lg mb-3 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      ⭐ {review.rating}점
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "qna" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ❓ 상품 문의
            </h3>
            <p className="text-sm text-gray-500">
              문의 기능은 추후 구현 예정입니다.
            </p>
          </div>
        )}

        {activeTab === "notice" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🚚 구매 확인사항
            </h3>
            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 space-y-2">
              <p>📦 배송 정보: 기본 배송일은 2~3일 소요됩니다.</p>
              <p>🔄 교환/반품 안내: 제품 수령 후 7일 이내 가능합니다.</p>
              <p>🚫 단순 변심, 개봉 시에는 교환/반품이 제한될 수 있습니다.</p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
