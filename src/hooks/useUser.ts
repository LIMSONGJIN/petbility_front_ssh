import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/auth";
import { User } from "@/types/api";

// 사용자 정보 조회 훅
export const useUser = () => {
  const queryClient = useQueryClient();

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

  // 사용자 정보 업데이트
  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (updatedUser) => {
      // 캐시 업데이트
      queryClient.setQueryData(["user"], updatedUser);
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
