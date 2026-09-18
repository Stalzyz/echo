"use client"

import React from "react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full w-full bg-slate-50 text-slate-900 font-sans overflow-y-auto custom-scrollbar min-w-0">
      {children}
    </div>
  )
}
