import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/theme-provider"
import { AudioProvider } from "@/contexts/AudioContext"
import AudioPermissionModal from "@/components/AudioPermissionModal"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GOT GAME",
  description: "Live trivia with luck and style!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AudioProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AudioPermissionModal />
            {children}
          </ThemeProvider>
        </AudioProvider>
      </body>
    </html>
  )
}
