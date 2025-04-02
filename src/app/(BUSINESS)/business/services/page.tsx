"use client";

import { useEffect, useState } from "react";
import { fetchBusinessServices } from "@/api/business/services";
import { Service } from "@/types/service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BusinessServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBusinessServices();
        setServices(data);
      } catch (err) {
        console.error("서비스 조회 실패:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 서비스 목록</h1>
        <Button onClick={() => router.push("/business/services/new")}>
          새 서비스 등록
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length === 0 ? (
          <p className="text-gray-500">등록된 서비스가 없습니다.</p>
        ) : (
          services.map((service) => (
            <Card
              key={service.service_id}
              className="hover:shadow-lg cursor-pointer"
              onClick={() =>
                router.push(`/business/services/${service.service_id}`)
              }
            >
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-1">{service.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {service.description}
                </p>
                <p className="text-sm">
                  가격: {Number(service.price).toLocaleString()}원
                </p>
                <p className="text-sm">카테고리: {service.category}</p>
                <p className="text-sm">
                  진열 상태: {service.is_deleted ? "숨김" : "진열 중"}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
