// app/api/auth.ts
export const getUserFromBackend = async (token: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "유저 정보 요청 실패");
    }

    return await res.json(); // 사용자 정보
  } catch (err) {
    console.error("auth/me 요청 실패:", err);
    throw err;
  }
};
