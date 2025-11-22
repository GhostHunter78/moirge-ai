"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseClient";

function ForgotPasswordMain() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-teal-50 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-teal-100 bg-white/90 p-8 shadow-xl shadow-teal-200/50 mx-auto flex flex-col items-center">
        {submitted ? (
          <div className="w-full text-center">
            <span className="flex justify-center items-center w-12 h-12 rounded-full bg-teal-100 mx-auto mb-4">
              <Mail className="h-6 w-6 text-teal-500" />
            </span>
            <h2 className="text-xl font-semibold mb-2 text-teal-700">
              Check your email
            </h2>
            <p className="text-slate-600 mb-2">
              If an account exists for <b>{email}</b>, you&apos;ll receive a
              password reset link shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <span className="flex justify-center items-center w-14 h-14 rounded-full bg-teal-50 mb-4">
                <Mail className="h-7 w-7 text-teal-500" />
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                Forgot your password?
              </h1>
              <p className="text-base md:text-lg text-slate-600">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>
            <form
              className="w-full mt-2"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email address
              </label>
              <div className="flex items-center bg-white border border-teal-200 rounded-2xl px-4 py-3 shadow-inner focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition">
                <Mail className="h-5 w-5 text-teal-500" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="ml-3 border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none flex-1 focus-visible:ring-0"
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                disabled={loading || !email}
                className="mt-6 w-full rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 flex items-center justify-center"
              >
                {loading ? (
                  <span>
                    <svg
                      className="animate-spin inline h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default ForgotPasswordMain;
