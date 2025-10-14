"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export interface NavLinkInterface {
  id?: string;
  link: string;
  icon?: React.ReactNode;
  label?: string;
  labelClass?: string;
  activeClassName?: string;
  className?: string;
  props?: any;
  children?: React.ReactNode;
  onClick?: () => any;
  subMenu?: {
    id?: string;
    label: string;
    link: string;
  }[];
  state?: boolean;
  isExpanded?: boolean;
  badge?: string;
  setState?: (value: any) => void;
}

export function NavLink({
  icon,
  label,
  link,
  activeClassName,
  labelClass,
  className,
  props,
  children,
  onClick,
  subMenu,
  state,
  isExpanded,
  badge,
  setState,
}: NavLinkInterface) {
  const pathname = usePathname();

  const hasSubmenu = subMenu && subMenu.length > 0;
  const isActive = pathname === link;
  const hasActiveSubmenu = subMenu?.some(item => pathname === item.link);

  const handleclick = (e: React.MouseEvent) => {
    // If item has submenu and menu is closed, open it
    if (hasSubmenu && !state && setState) {
      setState(true);
    }

    // Always call onClick to toggle expansion
    onClick?.();
  };

  // If item has submenu, use div (no navigation)
  // If no submenu, use Link (allows navigation)
  const WrapperComponent = hasSubmenu ? 'div' : Link;
  const wrapperProps = hasSubmenu ? {} : { href: link, ...props };

  return (
    <div className="flex flex-col">
      <WrapperComponent
        {...wrapperProps}
        onClick={handleclick}
        className={cn(
          "text-primary-foreground text-xs p-3 rounded-xl  justify-center relative flex flex-row items-center cursor-pointer",
          { "gap-2.5": label && icon },
          { "gap-0 justify-center": !state },
          (isActive || hasActiveSubmenu) && "bg-primary-hover before:absolute before:bg-accent before:-right-4.5 before:rounded-l-[6px] before:w-1.5 before:h-9",
          className
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {/* <span className={cn(" flex-grow text-white whitespace-nowrap",labelClass)}>
          {label}
        </span> */}
        {label && state && (
          <span className={cn("text-clip line-clamp-1 flex-grow", labelClass)}>
            {label}
          </span>
        )}
        {badge && state && (
          <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
            {/* For customer menu, show different badge when expanded */}
            {label === "مشتری" && isExpanded ? "۱۲" : badge}
          </span>
        )}
        {subMenu && subMenu.length > 0 && state && (
          <ChevronDownIcon color="white" className={cn(
            "w-4 h-4 ml-auto transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )} />
        )}
        {children}
      </WrapperComponent>

      {/* Collapsible submenu */}
      {subMenu && subMenu.length && isExpanded && (
        <div className={cn(
          "ml-4 pr-2  transition-all duration-200 ",
          isExpanded ? "h-auto opacity-100" : "h-0 opacity-0"
        )}>

          <div className="ml-4 mt-1  pr-2">
            {subMenu.map((item) => (
              <Link
                key={`subLink-${item.link}`}
                href={item.link}
                {...props}
                className={cn(
                  "text-primary-foreground text-xs py-2  w-full  relative flex items-center transition-all duration-200  mb-1",
                  pathname === item.link ? "text-white" : ""
                )}
              >
                {state && (
                  <>
                    <span className={cn("w-2 h-2 rounded-full mr-2 flex-shrink-0", pathname === item.link ? "bg-info" : " bg-white/40")}></span>

                    <span className="text-white overflow-visible pr-1" >
                      {item.label}
                    </span>
                  </>
                )}

              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
