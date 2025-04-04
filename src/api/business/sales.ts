import { SalesData, SalesSummary } from "@/types/sales";

export async function fetchSalesData(
  timeRange: "day" | "week" | "month"
): Promise<SalesData[]> {
  try {
    const response = await fetch(`/api/business/sales?range=${timeRange}`);
    if (!response.ok) {
      throw new Error("매출 데이터를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("매출 데이터 조회 중 오류 발생:", error);
    throw error;
  }
}

export async function fetchSalesSummary(
  timeRange: "day" | "week" | "month"
): Promise<SalesSummary> {
  try {
    const response = await fetch(
      `/api/business/sales/summary?range=${timeRange}`
    );
    if (!response.ok) {
      throw new Error("매출 요약 데이터를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("매출 요약 데이터 조회 중 오류 발생:", error);
    throw error;
  }
}
