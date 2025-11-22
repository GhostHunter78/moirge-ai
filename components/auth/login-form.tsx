import { useState } from "react";
import { SOCIAL_PROVIDERS } from "@/constants/social-providers";
import Link from "next/link";

function LoginForm({
  handleLogin,
  error,
  emailError,
  passwordError,
  signInWithGoogle,
  signInWithFacebook,
}: {
  handleLogin: (e: React.FormEvent) => void;
  error: string;
  emailError?: string;
  passwordError?: string;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    setLoading(true);
    try {
      await handleLogin(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-emerald-100 bg-linear-to-b from-white via-white to-emerald-50 p-8 shadow-xl shadow-emerald-200/60">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">
          Welcome Back
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Sign in to your account
        </h1>
      </div>

      {error && (
        <div className="mt-6 mb-2 text-sm text-left text-red-500">{error}</div>
      )}

      <form className="mt-8 grid" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-slate-700">
          Email address
          <div className="mt-2 flex items-center rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-inner shadow-emerald-50 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
            <svg
              className="h-5 w-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
              />
            </svg>
            <input
              type="email"
              placeholder="you@example.com"
              className="ml-3 w-full border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              name="email"
              disabled={loading}
            />
          </div>
          {/* Field error */}
          {!!emailError && (
            <p className="mt-2 text-sm text-red-500">{emailError}</p>
          )}
        </label>

        <label className="text-sm font-semibold text-slate-700 mt-5">
          Password
          <div className="mt-2 flex items-center rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-inner shadow-emerald-50 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
            <svg
              className="h-5 w-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 3h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 1 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z"
              />
            </svg>
            <input
              type="password"
              placeholder="Enter your password"
              className="ml-3 w-full border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              name="password"
              disabled={loading}
            />
          </div>
          {/* Field error */}
          {!!passwordError && (
            <p className="mt-2 text-sm text-red-500">{passwordError}</p>
          )}
        </label>
        {/* Remove error message here as it's now at the top */}

        <div className="mt-2 text-right">
          <button
            type="button"
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 flex items-center justify-center"
          disabled={loading}
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
              Signing in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-8 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {SOCIAL_PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            type="button"
            className="group flex flex-1 items-center gap-3 rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40 cursor-pointer"
            disabled={loading}
            onClick={
              provider.name === "Google"
                ? signInWithGoogle
                : provider.name === "Facebook"
                ? signInWithFacebook
                : undefined
            }
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-inner shadow-emerald-100">
              {provider.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {provider.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        {"Don't"} have an account?{" "}
        <Link
          href="/auth/signup"
          type="button"
          className="font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}

export default LoginForm;
