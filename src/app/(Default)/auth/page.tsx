
import AuthForm from "@/components/Forms/AuthForm";
import Link from "next/link";

const AuthPage = () => {
  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <Link href="/" className="underline">
        Go to Home
      </Link>
      <Link href="/auth/signup" className="underline">
        Go to Sign Up
      </Link>
      <Link href="/auth/signin" className="underline">
        Go to Sign In
      </Link>
      <AuthForm />
    </div>
  );
};

export default AuthPage;