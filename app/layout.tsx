import ProvidersWrapper from "@/context/providers-wrapper";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crocante Dashboard",
  description: "Crocante Dashboard",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ProvidersWrapper>
          {children}
          <Analytics />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
