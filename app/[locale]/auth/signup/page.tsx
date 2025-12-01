"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "@/lib/routing";
import SignupPage from "@/components/auth/signup-page";
import type { SignupFormValues } from "@/components/auth/signup-form";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function handleSignup(values: SignupFormValues) {
    setError("");
    const { email, password, username, role, phone } = values;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      const errorKey =
        authError.message === "User already registered"
          ? "userAlreadyRegistered"
          : "unableToComplete";
      setError(errorKey);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setError("unableToComplete");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username,
      role,
      phone,
    });

    if (profileError) {
      const errorKey =
        profileError.code === "23505"
          ? "profileAlreadyExists"
          : "unableToComplete";
      setError(errorKey);
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pendingVerificationEmail", email.toLowerCase());
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return <SignupPage handleSignup={handleSignup} error={error} />;
}
