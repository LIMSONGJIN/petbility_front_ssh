"use server";

import { Provider } from "@supabase/supabase-js";
import { createClientForServer } from "./server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
  }

  redirect(data.url as string);
};

const signInWithGoogle = signInWith("google");
const signInWithKakao = signInWith("kakao");

const signupWithEmailPassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  let profileImageUrl = "";
  if (formData.get("profileImage") instanceof File) {
    profileImageUrl = await uploadProfileImage(
      formData.get("profileImage") as File
    );
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        profileImage: profileImageUrl,
        address: formData.get("address") as string,
        role: formData.get("role") as string,
        latitude: 0,
        longitude: 0,
      },
    },
  });

  console.log(authData);

  if (authError) {
    console.log("Supabase 에러:", authError.message);
    return { message: authError.message };
  }
  const user = authData.user;
  if (!user) {
    return { message: "유저 생성에 실패했습니다." };
  }

  // ✅ JWT access token 추출
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  // ✅ NestJS 백엔드로 회원 정보 전달
  const response = await fetch(`${process.env.API_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // JWT 인증
    },
    body: JSON.stringify({
      user_id: user.id,
      email: user.email,
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      profile_image: profileImageUrl,
      role: formData.get("role"),
      latitude: 0,
      longitude: 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("백엔드 저장 실패:", errorText);
    return { message: "백엔드 사용자 저장에 실패했습니다." };
  }

  return redirect("/auth/callback/client");
};

const uploadProfileImage = async (file: File) => {
  const supabase = await createClientForServer();
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file);

  if (error) {
    console.log("이미지 업로드 실패:", error.message);
    return "";
  }

  // 저장된 파일의 Public URL 반환
  const { data: publicUrlData } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

const signinWithEmailPassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    console.log(error);
    return { message: error.message };
  }

  return { success: true }; // ✅ 리다이렉트 하지 않고 결과만 반환
};

const sendResetPasswordForEmail = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string
  );

  if (error) {
    console.log(error);
    revalidatePath("/auth/reset");
    return { message: error.message };
  } else return { message: "Please check your email!" };
};

const updatePassword = async (prev: any, formData: FormData) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    console.log(error);
    revalidatePath("/auth/reset");
    return { message: error.message };
  } else return { message: "Password updated!" };
};

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export {
  signInWithGoogle,
  signInWithKakao,
  signOut,
  signupWithEmailPassword,
  signinWithEmailPassword,
  sendResetPasswordForEmail,
  updatePassword,
  uploadProfileImage,
};
