import SignInForm from "@/components/auth/SignInForm";
import { DevSignInButton } from "@/components/auth/DevSignInButton";

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center p-6"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <SignInForm />
        <div className="w-full max-w-[28rem]">
          <DevSignInButton />
        </div>
      </div>
    </div>
  );
}
