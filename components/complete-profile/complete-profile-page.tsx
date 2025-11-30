"use client";

import CompleteProfileForm from "./complete-profile-form";
import type { CompleteProfileFormValues } from "./complete-profile-form";

export default function CompleteProfilePage({
  handleCompleteProfile,
  error,
}: {
  handleCompleteProfile: (
    values: CompleteProfileFormValues
  ) => Promise<void> | void;
  error: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Form Section */}
      <div className="w-full flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <CompleteProfileForm
          handleCompleteProfile={handleCompleteProfile}
          error={error}
        />
      </div>
    </div>
  );
}

