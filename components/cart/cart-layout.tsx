"use client";
import React, { useState } from "react";
import Header from "@/components/shared/header";
import Drawer from "@/components/shared/drawer";
import { cn } from "@/lib/utils";
import { cartDrawerLinks } from "@/constants/navigation-links";

export default function CartLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="relative flex flex-row w-full overflow-hidden">
            {/* Cart-specific sidebar with minimal links */}
            <Drawer
                state={isDrawerOpen}
                setState={setIsDrawerOpen}
                sideBarLinks={cartDrawerLinks}
            />

            {/* Mobile overlay */}
            <div
                className={cn(
                    "w-full h-full opacity-100 z-30 absolute bg-black/75 lg:hidden duration-200 transition-all",
                    {
                        "opacity-0 -z-50": !isDrawerOpen,
                    }
                )}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Main content area */}
            <div
                className={cn(
                    "flex flex-col w-full lg:w-[calc(100vw-82px)] transition-all duration-250 ease-in-out",
                    {
                        "lg:w-calc(100vw-320px)": isDrawerOpen,
                    }
                )}
            >
                {/* Cart header with minimal functionality */}
                <Header
                    state={isDrawerOpen}
                    setState={setIsDrawerOpen}
                />

            </div>

            {/* <CartContainer /> */}

        </div>
    );
}
