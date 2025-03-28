export const createUserInBackend = async (userData: {
  id: string;
  name: string;
  phone: string;
  address: string;
  profile_image: string;
  role: string;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "사용자 생성 실패");
    }

    return await res.json();
  } catch (err) {
    console.error("백엔드 유저 생성 실패:", err);
    throw err;
  }
};
