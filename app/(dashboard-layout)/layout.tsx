"use client";

import "../../globals.css";
import Layout from "@/components/shared/layout";
import localFont from "next/font/local";
import "../../globals.css";
import { store } from "../../store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
            <Layout>{children}</Layout>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
