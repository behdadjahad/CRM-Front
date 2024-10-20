import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center text-center gap-2 justify-center whitespace-nowrap rounded-lg shadow-button font-normal ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-1",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-secondary disabled:text-secondary disabled:bg-secondary-foreground",
        "primary-foreground":
          "border bg-transparent text-primary border-primary hover:text-secondary hover:border-secondary disabled:text-disable-mute disabled:border-disable-mute",
        foreground:
          "bg-background text-foreground disabled:text-disable-foreground disabled:bg-disable",
        // based on design system.
        background: "bg-foreground text-background disabled:bg-disable",
        secondary:
          "bg-secondary !text-secondary-foreground disabled:text-secondary disabled:bg-secondary-foreground hover:text-secondary-foreground",
        "secondary-foreground":
          "border bg-secondary-foreground !text-secondary font-semibold border-secondary disabled:text-disable-mute disabled:border-disable-mute",
        accessible:
          "bg-accessible !text-accessible-foreground disabled:text-accessible disabled:bg-accessible-foreground !shadow-[2px_4px_4px_0px_#00000040]",
        "secondary-footer":
          "bg-secondary-foreground text-secondary disabled:text-secondary disabled:bg-secondary-foreground",
        outline:
          "border bg-transparent text-primary-foreground border-primary-foreground disabled:text-disable-mute disabled:border-disable-mute",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "tertiary-gradient":
          "bg-gradient-to-tr from-tertiary-active/80 to-tertiary/60 text-tertiary-foreground",
        transparent: "bg-transparent font-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 py-6 px-2",
        xs: "text-sm py-1.5 px-3 leading-5",
        sm: "text-sm py-2 px-[15px] leading-5",
        md: "text-base py-2.5 px-5 leading-6",
        lg: "text-sm lg:text-lg py-2 lg:py-3 px-4 lg:px-5 leading-7",
        xl: "text-sm lg:text-base px-4 py-2 lg:py-3.5 lg:px-5 leading-7",
        xxl: "text-lg py-4 px-6 leading-7",
      },
      radius: {
        default: "rounded-full",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, radius, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
