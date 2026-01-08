"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import Navbar from "@/components/home-page/navbar";
import { Profile } from "@/types/user-profile";
import HeroSection from "@/components/home-page/hero-section";
import FeaturesSection from "@/components/home-page/features-section";
import HowItWorksSection from "@/components/home-page/how-it-works-section";
import FaqSection from "@/components/home-page/faq-section";
import TestimonialsSection from "@/components/home-page/testimonioals-section";
import Footer from "@/components/home-page/footer";

export default function HomePageClient() {
  const supabase = useMemo(() => createClient(), []);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [supabase]);

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

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setIsSignedIn(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setIsSignedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="w-full mx-auto pt-[65px] overflow-x-hidden">
      <Navbar isSignedIn={isSignedIn} userInfo={userInfo} />
      <HeroSection isSignedIn={isSignedIn} userInfo={userInfo} />
      <FeaturesSection userInfo={userInfo} />
      <HowItWorksSection userInfo={userInfo} />
      <TestimonialsSection userInfo={userInfo} />
      <FaqSection />
      <Footer userInfo={userInfo} />
    </div>
  );
}
