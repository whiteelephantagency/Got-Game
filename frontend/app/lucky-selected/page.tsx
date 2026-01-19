"use client"

import { Suspense } from "react"
import { LuckySelectedContent } from "../../app/lucky-selected/lucky-selected-content"

export default function LuckySelected() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <LuckySelectedContent />
    </Suspense>
  )
}
