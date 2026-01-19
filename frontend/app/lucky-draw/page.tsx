import React, { Suspense } from "react";
import LuckyDrawClient from "./LuckyDrawClient";

export default function LuckyDrawPage() {
  return (
    <Suspense fallback={<div className="text-white p-6 text-center">Loading Lucky Draw...</div>}>
      <LuckyDrawClient />
    </Suspense>
  );
}
