import React from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gestión",
  description: "Gestión App",
};

export default function RootLayout({ children } : Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className="font-work-sans"
            >
                {children}
                <Toaster />
            </body>
        </html>        
    )
}