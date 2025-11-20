"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SignupPage from "@/components/auth/signup-page";
import type { SignupFormValues } from "@/components/auth/signup-form";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

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
      const message =
        authError.message === "User already registered"
          ? "An account with this email already exists."
          : authError.message;
      setError(message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setError("Unable to complete signup. Please try again.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username,
      role,
      phone,
    });

    if (profileError) {
      const message =
        profileError.code === "23505"
          ? "This account already exists. Please log in instead."
          : profileError.message;
      setError(message);
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return <SignupPage handleSignup={handleSignup} error={error} />;
}
