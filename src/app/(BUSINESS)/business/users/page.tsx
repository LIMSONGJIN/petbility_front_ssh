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
import { businessApi } from "@/app/api/business/business";
import { toast } from "react-toastify";

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await businessApi.getUsers();
        setUsers(data);
        console.log("사용자 목록 로드 성공:", data.length, "명의 사용자");
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("사용자 목록을 불러오는데 실패했습니다.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.includes(searchQuery) ||
      user.phone.includes(searchQuery) ||
      user.address?.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="h-9 flex-1 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 flex-1 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">사용자 관리</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="이름, 전화번호, 주소로 검색"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            사용자가 없습니다
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {searchQuery
              ? "검색 조건에 맞는 사용자가 없습니다. 다른 검색어로 시도해보세요."
              : "아직 등록된 사용자가 없습니다."}
          </p>
          <Button
            onClick={() => setSearchQuery("")}
            variant="outline"
            className={searchQuery ? "block" : "hidden"}
          >
            모든 사용자 보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="이름, 전화번호, 주소로 검색"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card
            key={user.user_id}
            className="hover:shadow-md transition-shadow bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{user.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {user.address || "주소 정보 없음"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    최근 방문:{" "}
                    {format(new Date(user.updated_at), "yyyy.MM.dd", {
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
                  onClick={() => router.push(`/business/users/${user.user_id}`)}
                >
                  상세 정보
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-gray-200"
                  onClick={() =>
                    router.push(
                      `/business/reservations?user_id=${user.user_id}`
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
