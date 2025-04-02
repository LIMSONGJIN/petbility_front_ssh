// 📁 src/api/axios.ts
import axios from "axios";
import { getAccessTokenClient } from "@/utils/auth/getAccessTokenClient";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 클라이언트 전용으로 안전하게 토큰 삽입
api.interceptors.request.use(async (config) => {
  try {
    const token = await getAccessTokenClient();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    console.warn("No token available:", err);
  }
  return config;
});

export default api;
