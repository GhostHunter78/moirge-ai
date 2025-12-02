"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "@/lib/routing";
import LoginPage from "@/components/auth/login-page";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPageMain() {
  const t = useTranslations();
  const tLogin = useTranslations("login");
  const router = useRouter();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Get redirect parameter from URL
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      setTimeout(() => {
        setRedirectPath(redirect);
      }, 0);
    }
  }, []);

  const signInWithGoogle = async () => {
    const supabase = createClient();
    const callbackUrl = redirectPath
      ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
          redirectPath
        )}`
      : `${window.location.origin}/api/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
  };

  const signInWithFacebook = async () => {
    const supabase = createClient();
    const callbackUrl = redirectPath
      ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
          redirectPath
        )}`
      : `${window.location.origin}/api/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: callbackUrl,
      },
    });
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = (form.get("email") as string) ?? "";
    const password = (form.get("password") as string) ?? "";

    const parsed = loginSchema(t).safeParse({ email, password });
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
      setError(error.message || tLogin("errors.invalidCredentials"));
      return;
    }

    // Redirect to the intended path or home
    router.push(redirectPath || "/");
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
