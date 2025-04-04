import { Service } from "@/types/service";

export async function fetchBusinessServices(): Promise<Service[]> {
  const response = await fetch("/api/business/services");
  if (!response.ok) {
    throw new Error("서비스 목록 조회 실패");
  }
  return response.json();
}

export async function updateServiceStatus(
  serviceId: string,
  isActive: boolean
): Promise<void> {
  const response = await fetch(`/api/business/services/${serviceId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_active: isActive }),
  });

  if (!response.ok) {
    throw new Error("서비스 상태 변경 실패");
  }
}
