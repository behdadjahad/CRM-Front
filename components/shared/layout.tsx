"use client";
import React, { useState } from "react";
import Header from "./header";
import Drawer from "./drawer";
import { cn } from "@/lib/utils";
import { drawerLinks } from "@/constants/navigation-links";
import { fetchUserData } from "@/store/user-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative flex flex-row w-full overflow-hidden">
      <Drawer state={isDrawerOpen} setState={setIsDrawerOpen} sideBarLinks={drawerLinks}/>
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
        <Header state={isDrawerOpen} setState={setIsDrawerOpen} />
        {children}
      </div>
    </div>
  );
}
