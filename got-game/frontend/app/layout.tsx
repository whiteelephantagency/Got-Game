// // layout.tsx

// import type React from "react"
// import type { Metadata } from "next"
// import "./globals.css"
// import { Inter } from "next/font/google"
// import { ThemeProvider } from "../components/theme-provider"
// import { AudioProvider } from "@/hooks/useAudio" 
// import { GlobalAudioPrompt } from "@/components/AudioPermissionModal" 
// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "GOT GAME",
//   description: "Live trivia with luck and style!",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <AudioProvider>
//           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
//           <GlobalAudioPrompt />
//             {children}
//           </ThemeProvider>
//         </AudioProvider>
//       </body>
//     </html>
//   )
// }



// layout.tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/theme-provider"
import { AudioProvider } from "@/hooks/useAudio" 
import { GlobalAudioPrompt } from "@/components/AudioPermissionModal" // Ensure this path is correct
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = { // Use Metadata type
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
            {/* We place the prompt here. It will check the audio state.
                If audio is NOT enabled, it shows the overlay.
                If audio IS enabled (after a click), it renders {children}.
            */}
            <GlobalAudioPrompt>
                {children}
            </GlobalAudioPrompt>
          </ThemeProvider>
        </AudioProvider>
      </body>
    </html>
  )
}