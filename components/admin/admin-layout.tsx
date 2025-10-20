"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import Drawer from "../shared/drawer";
import Header from "../shared/header";
import { adminSideBarMenuLinks } from "@/constants/admin-sidebar-menu-links";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <div className="relative flex flex-row w-full overflow-hidden">
      <Drawer state={isDrawerOpen} setState={setIsDrawerOpen} sideBarLinks={adminSideBarMenuLinks} />
      <div
        className={cn(
          "w-full h-full opacity-100 z-30 absolute bg-black/75 lg:hidden duration-200 transition-all",
          {
            "opacity-0 -z-50": !isDrawerOpen,
          }
        )}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        className={cn(
          "flex flex-col w-full lg:w-[calc(100vw-82px)] transition-all duration-250 ease-in-out",
          {
            "lg:w-calc(100vw-320px)": isDrawerOpen,
          }
        )}
      >
        {/* <Header state={isDrawerOpen} setState={setIsDrawerOpen} /> */}
        {children}
      </div>
    </div>
  );
}
