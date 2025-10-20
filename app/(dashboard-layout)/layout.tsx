"use client";

import "../../globals.css";
import Layout from "@/components/shared/layout";
import localFont from "next/font/local";
import "../../globals.css";
import { store } from "../../store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import { AccessProvider } from "@/contexts/AccessContext"; // Add this import

// Removed: CartSSEProvider - Now using direct EventSource in useCartCount hook
// Removed: CartDebugger - No longer needed with simplified architecture

const iranSansBold = localFont({
  src: "../../public/fonts/IRANSans(FaNum)_Bold.ttf",
  variable: "--font-iran-sans-bold",
  weight: "700",
});

const iranSansMedium = localFont({
  src: "../../public/fonts/IRANSans(FaNum)_Medium.ttf",
  variable: "--font-iran-sans-medium",
  weight: "500",
});

const iranSans = localFont({
  src: "../../public/fonts/IRANSans(FaNum).ttf",
  variable: "--font-iran-sans",
  weight: "400",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`${iranSansBold.variable} ${iranSansMedium.variable} ${iranSans.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AccessProvider>
              {/* Cart count now uses direct EventSource via useCartCount hook - no provider needed */}
              <Layout>{children}</Layout>
            </AccessProvider>
          </Provider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
