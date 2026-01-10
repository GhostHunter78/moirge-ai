"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "@/lib/routing";

function ResetPasswordMain() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong, please try again.");
      }
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-teal-50 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-teal-100 bg-white/90 p-8 shadow-xl shadow-teal-200/50 mx-auto flex flex-col items-center">
        {success ? (
          <div className="w-full text-center">
            <span className="flex justify-center items-center w-12 h-12 rounded-full bg-teal-100 mx-auto mb-4">
              <Lock className="h-6 w-6 text-teal-500" />
            </span>
            <h2 className="text-xl font-semibold mb-2 text-teal-700">
              Password reset!
            </h2>
            <p className="text-slate-600 mb-2">
              Your password was updated. You can now sign in with your new
              password.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <span className="flex justify-center items-center w-14 h-14 rounded-full bg-teal-50 mb-4">
                <Lock className="h-7 w-7 text-teal-500" />
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                Set your new password
              </h1>
              <p className="text-base md:text-lg text-slate-600">
                Enter a secure new password. It must be at least 8 characters
                long.
              </p>
            </div>
            <form
              className="w-full mt-2"
              onSubmit={handleReset}
              autoComplete="off"
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                New password
              </label>
              <div className="flex items-center bg-white border border-teal-200 rounded-2xl px-4 py-3 shadow-inner focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 tran[...]
                <Lock className="h-5 w-5 text-teal-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your new password"
                  className="ml-3 border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none flex-1 focus-visible:ring-0"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  title={showPassword ? "Hide password" : "Show password"}
                  className="ml-2 p-1 rounded hover:bg-teal-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-500" />
                  )}
                </button>
              </div>

              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-slate-700 mb-2 mt-4"
              >
                Confirm password
              </label>
              <div className="flex items-center bg-white border border-teal-200 rounded-2xl px-4 py-3 shadow-inner focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 tran[...]
                <Lock className="h-5 w-5 text-teal-500" />
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="ml-3 border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none flex-1 focus-visible:ring-0"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  title={showConfirm ? "Hide password" : "Show password"}
                  className="ml-2 p-1 rounded hover:bg-teal-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5 text-slate-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-500" />
                  )}
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="mt-7 w-full rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600 focus:o[...]
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
                    Resetting...
                  </span>
                ) : (
                  "Set new password"
                )}
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default ResetPasswordMain;
