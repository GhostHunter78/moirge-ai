"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/login-page";

export default function LoginPageMain() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
  }

  return <LoginPage />;
}
