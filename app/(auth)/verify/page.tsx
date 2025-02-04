import { motion } from "framer-motion";
import { Suspense } from "react";
import { VerificationForm } from "./components/verification-form";

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export default async function VerifyPage(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              className="w-20 h-20 border-4 border-purple-500/20 rounded-full border-t-purple-500"
            />
          </div>
        }
      >
        <VerificationForm email={searchParams?.email || null} />
      </Suspense>
    </div>
  );
}
