"use client";

import { sendResetPasswordForEmail } from "@/utils/supabase/actions";
import { useActionState } from "react";

const ResetPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordForEmail,
    null
  );
  return (
    <form action={formAction} className="sign-form">
      <div className="text-sm text-gray-500">
        기존에 가입하신 이메일을 입력하시면, 비밀번호 변경 메일을
        발송해드립니다.
      </div>
      <div className="flex gap-2 flex-3">
        <input
          className="sign-input flex-1"
          type="email"
          name="email"
          placeholder="Email"
        />

        <button disabled={isPending} className="sign-btn flex-0.5">
          {isPending ? "요청 중..." : "변경 요청"}
        </button>
      </div>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default ResetPasswordForm;
