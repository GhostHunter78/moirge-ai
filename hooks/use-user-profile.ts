import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Profile } from "@/types/user-profile";

export function useUserProfile() {
  const supabase = useMemo(() => createClient(), []);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  return { userInfo, loading };
}
