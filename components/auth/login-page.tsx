"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginSidebar from "@/components/auth/login-sidebar";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from "./login-form";

export default function LoginPage() {
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2">
        <LoginSidebar />
      </div>
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <LoginForm />
      </div>
    </div>
  );
}
