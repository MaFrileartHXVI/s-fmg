import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "S-FMG | Spatial-Based Fleet Manifest Generator",
  description:
    "A specialized spatial synthetic data generator for modeling Multi-Trip Capacitated Vehicle Routing Problem with Time Windows (MT-CVRPTW) datasets in last-mile delivery segments.",
  keywords: [
    "Spatial Dataset",
    "Synthetic Data Generator",
    "MT-CVRPTW",
    "Last-Mile Delivery",
    "Fleet Manifest",
    "Route Optimization Research",
    "Next.js v16",
    "PostGIS",
  ],
  authors: [
    { name: "Muhammad Fauzul Hanif", url: "https://scholar.google.com" },
  ],
  creator: "Muhammad Fauzul Hanif",
  publisher: "Nama Laboratorium / Kampus Anda",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Spatial-Based Fleet Manifest Generator (S-FMG)",
    description:
      "Interactive spatial data synthesizer for routing algorithm optimization and benchmarking (GNN vs. GA).",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}