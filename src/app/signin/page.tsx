import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center p-6" style={{height: 'calc(100vh - 72px'}}>
      <SignInForm />
    </div>
  );
}
