"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "@/lib/routing";
import CompleteProfilePage from "@/components/complete-profile/complete-profile-page";
import type { CompleteProfileFormValues } from "@/components/complete-profile/complete-profile-form";

export default function CompleteProfilePageMain() {
  const t = useTranslations("completeProfile.page");
  const router = useRouter();
  const [error, setError] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      // Check if profile is already complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, phone, role")
        .eq("id", user.id)
        .single();

      if (
        profile &&
        profile.username !== null &&
        profile.phone !== null &&
        profile.role !== null
      ) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router, supabase]);

  async function handleCompleteProfile(values: CompleteProfileFormValues) {
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("errors.mustBeLoggedIn"));
      router.push("/auth/signin");
      return;
    }

    // Use upsert to insert or update the profile
    // This ensures the profile is created even if it doesn't exist
    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email || "",
        username: values.username,
        phone: values.phone,
        role: values.role,
      },
      {
        onConflict: "id",
      }
    );

    if (upsertError) {
      console.error("Profile upsert error:", upsertError);
      if (upsertError.code === "23505") {
        setError(t("errors.usernameTaken"));
      } else {
        setError(upsertError.message || t("errors.failedToSave"));
      }
      return;
    }

    router.push("/");
  }

  return (
    <CompleteProfilePage
      handleCompleteProfile={handleCompleteProfile}
      error={error}
    />
  );
}
