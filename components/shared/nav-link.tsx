"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkInterface {
  icon: React.ReactNode;
  link: string;
  label?: string;
  labelClass?: string;
  activeClassName?: string;
  className?: string;
  props?: any;
  onClick?: () => any;
}

export function NavLink({
  icon,
  label,
  link,
  activeClassName,
  labelClass,
  className,
  props,
  onClick,
}: NavLinkInterface) {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      {...props}
      onClick={onClick}
      className={cn(
        "text-base text-foreground flex flex-row-reverse items-center",
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
    </Link>
  );
}
