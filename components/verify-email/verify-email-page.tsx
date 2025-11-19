"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);

  const email = useMemo(() => searchParams.get("email"), [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const handleVerified = () => {
      if (!isMounted) return;
      setVerified(true);
      setChecking(false);
      router.replace("/");
    };

    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setChecking(false);
        return;
      }

      if (session?.user?.email_confirmed_at) {
        handleVerified();
      } else {
        setChecking(false);
        setVerified(false);
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email_confirmed_at) {
          handleVerified();
        }
      }
    );

    checkSession();
    const intervalId = window.setInterval(checkSession, 5000);

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      window.clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-neutral-50 to-teal-50 dark:from-neutral-950 dark:to-neutral-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-950 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col items-center">
        <div className="bg-teal-100 dark:bg-teal-900 mb-6 p-4 rounded-full flex items-center justify-center">
          <Mail className="text-teal-700 dark:text-teal-300" size={38} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-teal-800 dark:text-teal-200">
          Check your inbox to verify your email address
        </h1>
        <p className="text-muted-foreground text-center mb-6 text-base">
          We&apos;ve sent a confirmation email
          {email ? (
            <>
              {" "}
              to <span className="font-semibold text-teal-900">{email}</span>
            </>
          ) : (
            " to your inbox"
          )}
          .<br />
          Please click the link inside to verify your account. You must verify
          your email address to continue.
        </p>
        {/* Inserted custom instructions here */}
        <div className="mb-6 w-full">
          <p className="text-base text-center text-neutral-800 dark:text-neutral-200">
            After you follow the link, please just close this tab.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="text-sm text-neutral-600 dark:text-neutral-300 text-center">
            Didn&apos;t receive the email?
          </div>
          <Button variant="outline" className="w-full" disabled>
            Resend Email (coming soon)
          </Button>
        </div>
        <div className="mt-8 w-full flex flex-col items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-3">
            {checking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
                <span>Waiting for verification...</span>
              </>
            ) : verified ? (
              <>
                <CheckCircle
                  size={18}
                  className="text-teal-600 dark:text-teal-400"
                />
                <span>Verified! Redirecting you home.</span>
              </>
            ) : (
              <>
                <CheckCircle
                  size={18}
                  className="text-neutral-400 dark:text-neutral-600"
                />
                <span>Pending verification</span>
              </>
            )}
          </div>
          <div className="text-center text-neutral-600 dark:text-neutral-300 mb-2">
            Make sure to check your <b>Spam</b> or <b>Promotions</b> folders.
          </div>
          {/* Contact support info */}
          <div className="text-center mt-2">
            <span>
              Still need help? Contact{" "}
              <a
                href="mailto:support@moirge.ai"
                className="underline text-teal-700 dark:text-teal-300"
              >
                support@moirge.ai
              </a>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
