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
}: NavLinkInterface) {
  const pathname = usePathname();
  const handleclick = (e: React.MouseEvent) => {
    if (subMenu && subMenu.length > 0 && state) {
      e.preventDefault();
      onClick?.();
    } else {
      onClick?.();
    }
  };
  useEffect(() => {
    console.log("_______________isExpanded_________________", isExpanded);
  }, [isExpanded]);

  return (
    <div className="flex flex-col">
      <div
        onClick={handleclick}
        className={cn(
          "text-primary-foreground text-xs p-3 rounded-xl relative flex flex-row items-center cursor-pointer",
          { "gap-2.5": label && icon },
          pathname == link ? "bg-primary-hover before:absolute before:bg-orange-500 before:-right-4.5 before:rounded-l-[6px] before:w-1.5 before:h-9" : "",
          className
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label && state && (
          <span className={cn("text-clip line-clamp-1 flex-grow", labelClass)}>
            {label}
          </span>
        )}
        {badge && state && (
          <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
            {badge}
          </span>
        )}
        {subMenu && subMenu.length > 0 && state && (
          <ChevronDownIcon className={cn(
            "w-4 h-4 ml-auto transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )} />
        )}
        {children}
      </div>


      {/* Inline submenu for expanded state */}
      {subMenu && subMenu.length && isExpanded && (
        <div className={cn(
          "ml-4 border-r-2 border-white/10 pr-2 overflow-hidden transition-all duration-200 bg-danger",
          isExpanded ? "max-h-96 bg-danger opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-1">
            {subMenu.map((item) => (
              <Link
                key={`subLink-${item.link}`}
                href={item.link}
                {...props}
                onClick={onClick}
                className={cn(
                  "text-primary-foreground text-xs py-2 px-3 rounded-lg relative flex items-center mb-1",
                  pathname == item.link ? "bg-primary-hover before:absolute before:bg-orange-500 before:-right-2 before:rounded-l-[6px] before:w-1 before:h-6" : "hover:bg-white/5"
                )}
              >
                <span className="w-2 h-2 bg-white/40 rounded-full mr-2 flex-shrink-0"></span>
                <span className="text-clip line-clamp-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
