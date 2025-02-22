import { Suspense } from "react";
import { Loading } from "./components/loading";
import { VerificationForm } from "./components/verification-form";

export default async function VerifyPage(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <Suspense fallback={<Loading />}>
        <VerificationForm email={searchParams?.email || null} />
      </Suspense>
    </div>
  );
}
