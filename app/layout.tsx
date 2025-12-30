import ProvidersWrapper from "@/context/providers-wrapper";
import "flowbite/dist/flowbite.css";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crocante Dashboard",
  description: "Crocante Dashboard",
  icons: {
    icon: [
      {
        url: "/images/design-mode/1X_Logo.png",
        type: "image/png",
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
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
