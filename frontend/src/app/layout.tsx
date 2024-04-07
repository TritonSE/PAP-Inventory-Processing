import { Inter } from "next/font/google";
import React from "react";

import type { Metadata } from "next";
import "@/app/globals.css";
import { UserContextProvider } from "@/contexts/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Patriots & Paws",
  description: "Web application for Patriots & Paws",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
