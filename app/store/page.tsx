"use client";

import { Suspense } from "react";
import { StoreContent } from "./components/store-content";

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
          </div>
        }
      >
        <StoreContent />
      </Suspense>
    </div>
  );
}
