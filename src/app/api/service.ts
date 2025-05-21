import { ServiceCategory } from "@/types/api";

// API 응답 타입 정의
export interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number;
  category: ServiceCategory;
  created_at: string;
  updated_at: string;
  status?: "active" | "inactive";
  image?: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  category: ServiceCategory;
  image?: string;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  category?: ServiceCategory;
  status?: "active" | "inactive";
  image?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getToken() {
  return localStorage.getItem("token") || "";
}

export const serviceApi = {
  // 모든 서비스 조회 (누구나 접근 가능)
  getAllServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services`);

      if (!response.ok) {
        throw new Error("서비스 목록을 불러오는데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("서비스 목록 조회 오류:", error);
      return [];
    }
  },

  // 단일 서비스 조회 (누구나 접근 가능)
  getServiceById: async (serviceId: string): Promise<Service | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/services/${serviceId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("서비스를 찾을 수 없습니다.");
        }
        throw new Error("서비스 정보를 불러오는데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error(`서비스 조회 오류 (ID: ${serviceId}):`, error);
      return null;
    }
  },

  // 서비스 생성 (관리자만 접근 가능)
  createService: async (
    serviceData: CreateServicePayload
  ): Promise<Service | null> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/admin/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error("서비스 생성에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("서비스 생성 오류:", error);
      return null;
    }
  },

  // 서비스 수정 (관리자만 접근 가능)
  updateService: async (
    serviceId: string,
    serviceData: UpdateServicePayload
  ): Promise<Service | null> => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/services/${serviceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("서비스를 찾을 수 없습니다.");
        }
        throw new Error("서비스 수정에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error(`서비스 수정 오류 (ID: ${serviceId}):`, error);
      return null;
    }
  },

  // 서비스 삭제 (관리자만 접근 가능)
  deleteService: async (serviceId: string): Promise<boolean> => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("서비스를 찾을 수 없습니다.");
        }
        throw new Error("서비스 삭제에 실패했습니다.");
      }

      return true;
    } catch (error) {
      console.error(`서비스 삭제 오류 (ID: ${serviceId}):`, error);
      return false;
    }
  },
};
