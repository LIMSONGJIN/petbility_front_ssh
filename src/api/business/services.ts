import api from "../axios";

// ✅ 서비스 목록 조회
export const fetchBusinessServices = async () => {
  const res = await api.get("/business/services");
  return res.data;
};

// ✅ 서비스 등록
export const createBusinessService = async (payload: any) => {
  const res = await api.post("/business/services", payload);
  return res.data;
};

// ✅ 서비스 수정
export const updateBusinessService = async (id: string, payload: any) => {
  const res = await api.patch(`/business/services/${id}`, payload);
  return res.data;
};

// ✅ 서비스 삭제 (is_deleted 처리)
export const deleteBusinessService = async (id: string) => {
  await api.delete(`/business/services/${id}`);
  return true;
};
