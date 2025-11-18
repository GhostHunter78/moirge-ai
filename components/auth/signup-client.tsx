import React from "react";

function SignupClient({
  handleSignup,
  error,
}: {
  handleSignup: (e: React.FormEvent) => void;
  error: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSignup} className="w-80 space-y-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupClient;
