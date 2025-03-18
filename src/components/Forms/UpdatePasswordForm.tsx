"use client";

import { updatePassword } from "@/utils/supabase/actions";
import { useActionState } from "react";

const UpdatePasswordForm = () => {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  return (
    <form action={formAction} className="sign-form">
      <div className="flex gap-2 flex-3">
        <input
          className="sign-input flex-1"
          type="password"
          name="password"
          placeholder="password"
        />

        <button disabled={isPending} className="sign-btn flex-0.5">
          {isPending ? "요청 중..." : "변경 완료료"}
        </button>
      </div>
      {state && <span>{state.message}</span>}
    </form>
  );
};

export default UpdatePasswordForm;
