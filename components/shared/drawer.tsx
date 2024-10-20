import React from "react";
import Logo from "./logo";
import { credentialData } from "@/constants/credentials";
import { drawerLinks } from "@/constants/navigation-links";
import { NavLink } from "./nav-link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface DrawerInterface {
  state: boolean;
  setState: (prev: any) => any;
}

export default function Drawer({ state, setState }: DrawerInterface) {
  return (
    <div
      className={cn(
        "h-screen w-54 bg-primary text-primary-foreground pb-3 pt-4 px-4.5 transition-all duration-200 overflow-x-hidden",
        {
          "w-20.5": !state,
        }
      )}
    >
      <div className="flex flex-col w-full h-full">
        <Logo
          label={credentialData.name}
          labelClassName={!state ? "hidden" : ""}
          className={!state ? "gap-0 justify-center" : ""}
        />

        <div className="flex flex-col">
          {drawerLinks.map((item) => (
            <div key={item.category} className="flex flex-col">
              <div className="h-10 flex flex-col justify-center transition-all duration-200">
                {state ? (
                  <span className="text-xsl font-light text-muted text-clip">
                    {item.category}
                  </span>
                ) : (
                  <div className="bg-muted pb-px w-full" />
                )}
              </div>

              {item.links.map((linkItem) => (
                <NavLink
                  {...linkItem}
                  key={linkItem.label}
                  className="text-primary-foreground text-xsl p-3 rounded-xl before:absolute before:bg-secondary before:right-0 before:h-full before:w-2"
                  activeClassName="bg-primary-hover"
                  labelClass={!state ? "hidden" : ""}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-auto mb-2 bg-muted-foreground pb-px w-full" />

        <div
          onClick={() => setState((prev: any) => !prev)}
          className={cn(
            "flex flex-row-reverse items-center text-primary-foreground text-xsl p-3 rounded-xl cursor-pointer",
            { "gap-x-2.5": state }
          )}
        >
          <Image src={"/icons/menu.png"} alt="منو" width={22} height={22} />
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
