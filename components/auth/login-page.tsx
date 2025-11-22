"use client";

import LoginSidebar from "@/components/auth/login-sidebar";
import LoginForm from "./login-form";

export default function LoginPage({
  handleLogin,
  error,
  emailError,
  passwordError,
  signInWithGoogle,
  signInWithFacebook,
}: {
  handleLogin: (e: React.FormEvent) => void;
  error: string;
  emailError?: string;
  passwordError?: string;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2">
        <LoginSidebar />
      </div>
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <LoginForm
          handleLogin={handleLogin}
          error={error}
          emailError={emailError}
          passwordError={passwordError}
          signInWithGoogle={signInWithGoogle}
          signInWithFacebook={signInWithFacebook}
        />
      </div>
    </div>
  );
}
