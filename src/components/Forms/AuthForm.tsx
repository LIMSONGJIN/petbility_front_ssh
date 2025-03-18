"use client";

import { signInWithGoogle } from "@/utils/supabase/actions";

const AuthForm = () => {
  return (
    <div>
      <form>
        <button
          formAction={signInWithGoogle}
          className="border rounded px-2.5 py-2"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default AuthForm;