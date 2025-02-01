import { Suspense } from "react";
import { VerificationForm } from "./components/verification-form";

export default async function VerifyPage(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
        </div>
      }
    >
      <VerificationForm email={searchParams?.email || null} />
    </Suspense>
  );
}
