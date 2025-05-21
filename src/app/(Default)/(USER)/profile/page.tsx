"use client";

import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import Image from "next/image";
import { Eye, EyeOff, User, Mail, Phone, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { session, isAuthenticated } = useAuthStore();
  const { 
    user, 
    isLoading, 
    updateUser, 
    changePassword,
    isUpdating,
    isChangingPassword
  } = useUser();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [tab, setTab] = useState("profile"); // 'profile' 또는 'password'
  
  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);
  
  // 폼 입력 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 프로필 정보 업데이트
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUser({
        name: formData.name,
        phone: formData.phone,
      });
      
      toast.success("프로필 정보가 업데이트되었습니다.");
    } catch (error) {
      toast.error("프로필 업데이트에 실패했습니다.");
      console.error("프로필 업데이트 오류:", error);
    }
  };
  
  // 비밀번호 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      
      toast.success("비밀번호가 변경되었습니다.");
    } catch (error) {
      toast.error("비밀번호 변경에 실패했습니다.");
      console.error("비밀번호 변경 오류:", error);
    }
  };
  
  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-violet-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">접근 권한이 없습니다</h1>
        <p className="text-gray-600">로그인이 필요한 페이지입니다.</p>
        <Button className="mt-4" onClick={() => window.location.href = "/auth/signin"}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">내 프로필</h1>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8">
          {/* 프로필 요약 섹션 */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-32 h-32 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
              {user.profile_image ? (
                <Image 
                  src={user.profile_image} 
                  alt="프로필 이미지" 
                  width={128} 
                  height={128} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-violet-500" />
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                가입일: {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2 inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                {user.role === "ADMIN" ? "관리자" : 
                 user.role === "BUSINESS" ? "비즈니스" : "일반 사용자"}
              </div>
            </div>
          </div>
          
          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-2 px-1 ${
                  tab === "profile"
                    ? "text-violet-600 border-b-2 border-violet-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("profile")}
              >
                프로필 정보
              </button>
              <button
                className={`py-2 px-1 ${
                  tab === "password"
                    ? "text-violet-600 border-b-2 border-violet-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("password")}
              >
                비밀번호 변경
              </button>
            </div>
          </div>
          
          {/* 프로필 정보 탭 */}
          {tab === "profile" && (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleUpdateProfile}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} />
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} />
                  이메일 (변경 불가)
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={16} />
                  전화번호
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="전화번호를 입력하세요"
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "저장 중..." : "정보 저장하기"}
              </Button>
            </motion.form>
          )}
          
          {/* 비밀번호 변경 탭 */}
          {tab === "password" && (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleChangePassword}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="flex items-center gap-2">
                  <Key size={16} />
                  현재 비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="현재 비밀번호 입력"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-2">
                  <Key size={16} />
                  새 비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호 입력"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Key size={16} />
                  새 비밀번호 확인
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호 다시 입력"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "변경 중..." : "비밀번호 변경하기"}
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
} 