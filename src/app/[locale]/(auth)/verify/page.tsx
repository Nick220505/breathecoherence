import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading } from "./components/loading";
import { VerificationForm } from "./components/verification-form";

export default async function VerifyPage(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email;

  if (!email) {
    redirect("/register");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <Suspense fallback={<Loading />}>
        <VerificationForm email={email} />
      </Suspense>
    </div>
  );
}
