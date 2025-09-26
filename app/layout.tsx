
import type React from "react"
import { Roboto } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import "./env" 
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
const roboto = Roboto({
  subsets: ["latin"]})

export const metadata = {
  title: "PaidTube | Turn Free Playlists into Paid Content",
  description:
    "A powerful tool by Faisal Sheikh to convert free YouTube playlists into premium paid access collections. Start earning from your curated video content.",
  openGraph: {
    title: "PaidTube",
    description:
      "Monetize your free YouTube playlists and offer exclusive access to your best video content with Faisal Sheikh's smart platform.",
    url: "https://your-app-domain.com",
    siteName: "PaidTube",
    locale: "en_US",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaidTube",
    description:
      "Convert free YouTube playlists into paid exclusive access lists with Faisal Sheikh's powerful monetization tool.",
    images: [],
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeClass="dark"
  return (
    <ClerkProvider>
      <html lang="en" className={themeClass} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" />
        </head>
        
       <body className={roboto.className}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <Analytics/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    
  )
}


