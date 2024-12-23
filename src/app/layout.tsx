import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WelcomeUser from "@/components/welcome-user";
import { Suspense } from "react";
import Link from "next/link";

export const experimental_ppr = true

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerd Factory",
  description: "Nerd Factory by Crystallize",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <WelcomeUser />
        </Suspense>
        <h1 className="text-2xl p-3"><Link href='/'>Nerd Factory</Link></h1>
        {children}
      </body>
    </html>
  );
}
