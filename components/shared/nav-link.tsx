"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkInterface {
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
    label: string;
    link: string;
  }[];
  state?: boolean;
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
}: NavLinkInterface) {
  const pathname = usePathname();

  return (
    <div className={cn("relative", !state && subMenu?.length ? "group" : "")}>
      <Link
        href={link}
        {...props}
        onClick={onClick}
        className={cn(
          "text-base text-foreground flex flex-row items-center",
          { "gap-2.5": label && icon },
          pathname == link ? activeClassName : "",
          className
        )}
      >
        {icon}
        {label && (
          <span className={cn("text-clip line-clamp-1", labelClass)}>
            {label}
          </span>
        )}
        {children}
      </Link>
      {!state && subMenu && subMenu.length > 0 && (
        <div className="absolute right-full top-0 hidden group-hover:block bg-primary shadow-md rounded-md z-10  w-36 px-3 py-1">
          {subMenu.map((item) => (
            <Link
              key={`subLink-${item.link}`}
              href={item.link}
              {...props}
              onClick={onClick}
              className={cn(
                "px-3 py-1 block",
                pathname === item.link ? "bg-primary-hover rounded-lg" : "hover:border-b-2"
              )}
            >
              <span className={cn("text-xs text-clip")}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
      {state && subMenu &&
        subMenu.length > 0 &&
        subMenu.map((item) => {
          return (
            <Link
              href={item.link}
              {...props}
              onClick={onClick}
              className={cn(
                "text-base text-foreground flex flex-row items-center",
                { "gap-2.5": item.label && icon },
                pathname == item.link ? activeClassName : "",
                className
              )}
              key={`subLink-${item.link}`}
            >
              {item.label && (
                <span className={cn("text-clip line-clamp-1", labelClass)}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
    </div>
  );
}
