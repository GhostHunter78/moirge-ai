"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/login-page";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPageMain() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );

  const signInWithGoogle = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithFacebook = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = (form.get("email") as string) ?? "";
    const password = (form.get("password") as string) ?? "";

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError("");
      let emailIssue: string | undefined;
      let passwordIssue: string | undefined;
      for (const issue of parsed.error.issues) {
        const pathKey = issue.path?.[0];
        if (pathKey === "email" && !emailIssue) emailIssue = issue.message;
        if (pathKey === "password" && !passwordIssue)
          passwordIssue = issue.message;
      }
      setEmailError(emailIssue);
      setPasswordError(passwordIssue);
      return;
    }

    setEmailError(undefined);
    setPasswordError(undefined);

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Invalid login credentials");
      return;
    }

    router.push("/");
  }

  return (
    <LoginPage
      handleLogin={handleLogin}
      error={error}
      emailError={emailError}
      passwordError={passwordError}
      signInWithGoogle={signInWithGoogle}
      signInWithFacebook={signInWithFacebook}
    />
  );
}
