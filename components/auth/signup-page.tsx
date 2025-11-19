"use client";

import SignupForm, {
  type SignupFormValues,
} from "@/components/auth/signup-form";
import SignupSidebar from "@/components/auth/signup-sidebar";

export default function SignupPage({
  handleSignup,
  error,
}: {
  handleSignup: (values: SignupFormValues) => Promise<void> | void;
  error: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile/Tablet Background */}
      <div
        className="fixed inset-0 -z-10 md:hidden"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1080&query=ecommerce shopping gradient background modern)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2">
        <SignupSidebar />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <SignupForm handleSignup={handleSignup} error={error} />
        </div>
      </div>
    </div>
  );
}
