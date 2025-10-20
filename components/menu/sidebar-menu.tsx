import React, { useState } from "react";

import { drawerLinks } from "@/constants/navigation-links";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Logo from "../shared/logo";
import { NavLink } from "../shared/nav-link";

export interface SideBarMenuInterface {
  state: boolean;
  setState: (prev: any) => any;
  sideBarLinks: any[];
}

export default function SideBarMenu({
  state,
  setState,
  sideBarLinks,
}: SideBarMenuInterface) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      // If clicking the same item, collapse it
      if (prev.has(id)) {
        return new Set();
      }
      // Otherwise, collapse all and expand only the new item (accordion behavior)
      return new Set([id]);
    });
  };
  return (
    <div
      className={cn(
        "hidden lg:block w-0 absolute lg:relative h-screen lg:w-54 bg-primary text-primary-foreground pb-3 pt-4 px-4.5 transition-all duration-200 overflow-x-hidden",
        {
          // "lg:w-20.5": !state,
          "lg:w-26 lg:min-w-fit overflow-visible": !state,
        },
        {
          // "z-50 block w-4/5 max-w-96": state,
          "z-50 block w-4/5 max-w-96 overflow-x-hidden": state,
        }
      )}
    >
      <div className="flex flex-col w-full h-full">
        <Logo
          labelClassName={!state ? "hidden" : ""}
          className={!state ? "gap-0 justify-center" : ""}
        />

        <div className="flex flex-col">
          {sideBarLinks.map((item) => (
            <div key={item.category} className="flex flex-col">
              <div className="h-10 flex flex-col justify-center transition-all duration-200">
                {state ? (
                  <span className="text-xs font-light text-muted text-clip px-3">
                    {item.category}
                  </span>
                ) : (
                  <div className="bg-muted-foreground pb-px w-full" />
                )}
              </div>

              {item.links.map((linkItem: any) => (
                <div key={linkItem.label} className="relative group">
                  {!state && (
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-0 hidden group-hover:flex whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 z-1000 shadow-lg transition-opacity">
                      {linkItem.label}
                    </span>
                  )}
                  <NavLink
                    {...linkItem}
                    onClick={() => toggleExpanded(linkItem?.id || linkItem?.label || "")}
                    key={linkItem.label}
                    className="text-primary-foreground text-xs p-3 rounded-xl relative"
                    activeClassName="bg-primary-hover before:absolute before:bg-accent before:-right-4.5 before:rounded-l-[6px] before:w-1.5 before:h-9"
                    labelClass={!state ? "hidden" : ""}
                    state={state}
                    isExpanded={expandedItems.has(linkItem?.id || linkItem?.label || "")}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-auto mb-2 bg-muted-foreground pb-px w-full" />

        <div
          onClick={() => setState((prev: any) => !prev)}
          className={cn(
            "flex flex-row items-center text-primary-foreground text-xs p-3 rounded-xl cursor-pointer",
            { "gap-x-2.5": state }
          )}
        >
          <Image
            src={"/icons/menu-close.png"}
            alt="منو"
            width={22}
            height={22}
          />
          <span
            className={cn("w-auto line-clamp-1 transition-all duration-200", {
              " w-0": !state,
            })}
          >
            جمع کردن منو
          </span>
        </div>
      </div>
    </div>
  );
}
