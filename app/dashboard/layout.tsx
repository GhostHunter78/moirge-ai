"use client";

import { Profile } from "@/types/user-profile";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setUserInfo(null);
        return;
      }

      const { data: profile, error: userInfoError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userInfoError || !profile) {
        setUserInfo(null);
        return;
      }

      setUserInfo(profile);
    };

    fetchUser();
  }, [supabase]);

  return (
    <div className="flex">
      <DashboardSidebar userInfo={userInfo as Profile} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
