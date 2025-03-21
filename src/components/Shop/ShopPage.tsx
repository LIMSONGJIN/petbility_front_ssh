"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/data/service";
import { Heart } from "lucide-react";
import Link from "next/link";

const categories = ["전체", "사료", "장난감", "용품", "간식"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts =
    selectedCategory === "전체"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const productsPerPage = 15;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛍️ 펫 용품샵
      </h1>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full border transition text-sm font-medium shadow-sm hover:bg-violet-100 hover:text-violet-600 ${
              selectedCategory === cat
                ? "bg-violet-600 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {currentProducts.map((product) => {
          const hasDiscount = product.discount_price > 0;
          const displayPrice = hasDiscount
            ? product.discount_price
            : product.original_price;

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition"
            >
              <Image
                src={product.image_url}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-40 object-contain mb-4"
              />
              <h3 className="font-bold text-lg text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  {hasDiscount ? (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {product.original_price.toLocaleString()}원
                      </span>
                      <span className="text-violet-600 font-bold text-base">
                        {product.discount_price.toLocaleString()}원
                      </span>
                    </>
                  ) : (
                    <span className="text-violet-600 font-bold text-base">
                      {product.original_price.toLocaleString()}원
                    </span>
                  )}
                </div>

                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Heart size={16} className="text-red-400" /> {product.like}
                </span>
              </div>

              <Link className="w-full" href={`/shop/${product.product_id}`}>
                <button className="px-4 py-2 mt-4 w-full bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition">
                  구매하기
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-full text-sm font-medium border transition hover:bg-violet-100 ${
                currentPage === page
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
