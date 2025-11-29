import { Suspense } from "react";
import VerifyEmailPage from "@/components/verify-email/verify-email-page";

function page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}

export default page;
