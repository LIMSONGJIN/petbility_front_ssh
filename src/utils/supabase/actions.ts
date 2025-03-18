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

  const role = formData.get("role") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        profileImage: profileImageUrl,
        address: formData.get("address") as string,
        role: role,
      },
    },
  });

  console.log(authData);

  if (authError) {
    console.log(authError);
    revalidatePath("/auth/signup");
    return { message: authError.message };
  }
  const userId = authData.user?.id;
  if (userId) {
    const { error: dbError } = await supabase.from("user").insert([
      {
        id: userId,
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        profile_image: profileImageUrl,
        address: formData.get("address") as string,
        role: role,
      },
    ]);

    if (dbError) {
      console.log("DB 저장 실패:", dbError.message);
    }
  }

  redirect("/");
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

  console.log(data);

  if (error) {
    console.log(error);
    revalidatePath("/auth/signin");
    return { message: error.message };
  } else redirect("/");
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
