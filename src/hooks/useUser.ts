import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/app/api/auth";
import { User, UserRole } from "@/types/api";
import { useEffect, useRef } from "react";

// 사용자 정보 조회 훅
export const useUser = () => {
  const queryClient = useQueryClient();
  const hasUpdatedRole = useRef(false);

  // 사용자 정보 조회
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    retry: 1, // 실패 시 1번만 재시도
  });

  // 역할 동기화: API 응답을 우선적으로 처리
  useEffect(() => {
    // API에서 사용자 정보를 가져왔을 때 역할 정보 즉시 업데이트
    if (user?.role && !hasUpdatedRole.current) {
      const storedRole = localStorage.getItem("userRole");

      // 로컬 스토리지의 역할이 없거나 API 응답과 다른 경우 업데이트
      if (!storedRole || storedRole !== user.role) {
        console.log("useUser: API에서 역할 데이터 수신 - 스토리지 업데이트");
        console.log("- 이전 스토어 역할:", storedRole || "undefined");
        console.log("- 새 API 역할:", user.role);

        // API 응답 기반으로 로컬 스토리지 업데이트
        localStorage.setItem("userRole", user.role);

        // 플래그 설정으로 중복 실행 방지
        hasUpdatedRole.current = true;
      }
    }
  }, [user]);

  // 사용자 정보 업데이트
  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (updatedUser) => {
      // 캐시 업데이트
      queryClient.setQueryData(["user"], updatedUser);

      // 역할 정보 업데이트 - API 응답에 역할이 있으면 항상 로컬 스토리지 업데이트
      if (updatedUser.role) {
        localStorage.setItem("userRole", updatedUser.role);
      }
    },
  });

  // 비밀번호 변경
  const changePasswordMutation = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => userApi.changePassword(currentPassword, newPassword),
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
  };
};
