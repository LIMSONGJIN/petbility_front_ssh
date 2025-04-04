"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User, Phone, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Customer } from "@/types/business";
import { customerApi } from "@/api/business"; // API import

export default function CustomerManagementPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const { data } = await customerApi.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("고객 목록 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.includes(searchQuery) ||
      customer.phone.includes(searchQuery) ||
      customer.address?.includes(searchQuery)
  );

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-6">로딩 중...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">고객 관리</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="고객명, 전화번호, 주소로 검색"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.user_id}
            className="hover:shadow-md transition-shadow bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg font-semibold">{customer.name}</h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    최근 방문:{" "}
                    {format(new Date(customer.updated_at), "yyyy.MM.dd", {
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-gray-200"
                  onClick={() =>
                    router.push(`/business/customers/${customer.user_id}`)
                  }
                >
                  상세 정보
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-gray-200"
                  onClick={() =>
                    router.push(
                      `/business/reservations?customer_id=${customer.user_id}`
                    )
                  }
                >
                  예약 내역
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
