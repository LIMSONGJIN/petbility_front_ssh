import { User, Pet } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  phone?: string;
  password?: string;
  new_password?: string;
}

interface CreatePetData {
  name: string;
  type: string;
  breed?: string;
  age?: number;
  weight?: number;
  special_notes?: string;
  health_issues?: string;
}

interface UpdatePetData {
  name?: string;
  type?: string;
  breed?: string;
  age?: number;
  weight?: number;
  special_notes?: string;
  health_issues?: string;
}

// 사용자 관련 API
export const userApi = {
  // 회원가입
  register: async (
    userData: RegisterUserData
  ): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    return response.json();
  },

  // 로그인
  login: async (
    loginData: LoginData
  ): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    return response.json();
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "사용자 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 사용자 정보 수정
  updateUser: async (updateData: UpdateUserData): Promise<User> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "사용자 정보 수정에 실패했습니다.");
    }

    return response.json();
  },

  // 비밀번호 변경
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "비밀번호 변경에 실패했습니다.");
    }

    return { success: true };
  },

  // 사용자 애완동물 목록 조회
  getUserPets: async (): Promise<Pet[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "애완동물 목록을 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 특정 애완동물 조회
  getPet: async (petId: string): Promise<Pet> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/pets/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "애완동물 정보를 불러오는데 실패했습니다."
      );
    }

    return response.json();
  },

  // 애완동물 등록
  createPet: async (petData: CreatePetData): Promise<Pet> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "애완동물 등록에 실패했습니다.");
    }

    return response.json();
  },

  // 애완동물 정보 수정
  updatePet: async (petId: string, updateData: UpdatePetData): Promise<Pet> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "애완동물 정보 수정에 실패했습니다."
      );
    }

    return response.json();
  },

  // 애완동물 삭제
  deletePet: async (petId: string): Promise<{ success: boolean }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "애완동물 삭제에 실패했습니다.");
    }

    return { success: true };
  },
};
