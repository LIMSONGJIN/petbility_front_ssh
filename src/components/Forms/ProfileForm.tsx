"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase, BUCKET_NAME } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

interface ProfileFormValues {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      address: session?.user?.address || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm<PasswordFormValues>();

  const userInitials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      if (!session?.user?.id) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-profile.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      return null;
    }
  };

  const updateUserData = async (
    userId: string,
    userData: {
      name: string;
      image?: string | null;
      phone?: string;
      address?: string;
    }
  ) => {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "사용자 정보 업데이트에 실패했습니다."
      );
    }

    return response.json();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);

      let imageUrl = session?.user?.image || null;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          image: imageUrl,
          phone: data.phone,
          address: data.address,
        },
      });

      if (session?.user?.id) {
        await updateUserData(session.user.id, {
          name: data.name,
          image: imageUrl,
          phone: data.phone,
          address: data.address,
        });
      }

      toast.success("프로필이 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "비밀번호 변경에 실패했습니다.");
      }

      toast.success("비밀번호가 변경되었습니다.");
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      toast.error("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center">
        <p>로그인이 필요합니다.</p>
        <Button asChild className="mt-4">
          <a href="/auth/login">로그인</a>
        </Button>
      </div>
    );
  }

  const isEmailUser = session.user?.email && !session.user?.image;

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">프로필</TabsTrigger>
        <TabsTrigger value="pets">펫 정보</TabsTrigger>
        <TabsTrigger value="reservations">예약 내역</TabsTrigger>
        <TabsTrigger value="security">보안</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={imagePreview || session.user.image || ""}
                      alt={session.user.name || "프로필 이미지"}
                    />
                    <AvatarFallback className="bg-violet-200 text-violet-700 text-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Label
                      htmlFor="profile-image"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow hover:bg-primary/90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    사진을 업로드하세요. 선명한 얼굴 사진을 권장합니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    placeholder="이름을 입력하세요"
                    {...register("name", { required: "이름을 입력해주세요" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일 주소"
                    {...register("email")}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    placeholder="전화번호를 입력하세요"
                    {...register("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    placeholder="주소를 입력하세요"
                    {...register("address")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "변경사항 저장"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="pets">
        <Card>
          <CardHeader>
            <CardTitle>펫 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">등록된 펫이 없습니다.</p>
              <Button>펫 등록하기</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reservations">
        <Card>
          <CardHeader>
            <CardTitle>예약 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">예약 내역이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>보안 설정</CardTitle>
          </CardHeader>
          <CardContent>
            {isEmailUser ? (
              <form
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      {...registerPassword("currentPassword", {
                        required: "현재 비밀번호를 입력해주세요",
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      {...registerPassword("newPassword", {
                        required: "새 비밀번호를 입력해주세요",
                        minLength: {
                          value: 6,
                          message: "비밀번호는 최소 6자 이상이어야 합니다",
                        },
                      })}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      {...registerPassword("confirmPassword", {
                        required: "비밀번호 확인을 입력해주세요",
                        validate: (value) =>
                          value === watch("newPassword") ||
                          "비밀번호가 일치하지 않습니다",
                      })}
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  소셜 로그인을 사용하고 있으므로 별도의 비밀번호 설정이
                  필요하지 않습니다.
                </p>
                <p className="text-sm text-gray-500">
                  계정에 접근하는 데 문제가 있는 경우 고객 지원 팀에 문의하세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
