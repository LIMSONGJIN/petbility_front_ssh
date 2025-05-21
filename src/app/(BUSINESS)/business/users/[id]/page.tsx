"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Customer } from "@/types/business";
import { toast } from "sonner";
import { businessApi } from "@/app/api/business/business";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<Customer>>({});

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const data = await businessApi.getUser(params.id as string);
        setUser(data);
        setEditedUser(data);
      } catch (error) {
        console.error("사용자 정보를 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSave = async () => {
    try {
      await businessApi.updateUser(params.id as string, editedUser);
      setUser({ ...user, ...editedUser } as Customer);
      setIsEditing(false);
      toast.success("사용자 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("사용자 정보 업데이트에 실패했습니다:", error);
      toast.error("사용자 정보 업데이트에 실패했습니다.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex justify-end space-x-2">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">사용자를 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">사용자 상세 정보</h1>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>사용자 상세 정보</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">이름</label>
              {isEditing ? (
                <Input value={editedUser.name} onChange={handleInputChange} />
              ) : (
                <p>{user.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">이메일</label>
              {isEditing ? (
                <Input value={editedUser.email} onChange={handleInputChange} />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">전화번호</label>
              {isEditing ? (
                <Input value={editedUser.phone} onChange={handleInputChange} />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">메모</label>
              {isEditing ? (
                <Textarea
                  value={editedUser.memo}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.memo}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSave}>저장</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>수정</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
