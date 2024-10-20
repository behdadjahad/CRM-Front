"use client";
import React, { useState } from "react";
import Header from "./header";
import Drawer from "./drawer";
import { cn } from "@/lib/utils";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <div className="relative flex flex-row w-full overflow-hidden">
      <div
        className={cn(
          "flex flex-col w-[calc(100vw-82px)] transition-all duration-250 ease-in-out",
          {
            "w-calc(100vw-320px)": isDrawerOpen,
          }
        )}
      >
        <Header />
        <main className="w-full h-[calc(100vh-80px)] overflow-auto">
          {children}
        </main>
      </div>
      <Drawer state={isDrawerOpen} setState={setIsDrawerOpen} />
    </div>
  );
}
