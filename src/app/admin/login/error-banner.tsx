"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Banner() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;
  return <p className="mb-4 text-sm text-red-400">{error}</p>;
}

export function AdminLoginErrorBanner() {
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}
