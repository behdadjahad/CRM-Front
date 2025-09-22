"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
    children: React.ReactNode
    className?: string
}

interface SheetContentProps {
    children: React.ReactNode
    className?: string
    onClose?: () => void
}

interface SheetOverlayProps {
    className?: string
    onClick?: () => void
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
    ({ children, className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("fixed inset-0 z-50", className)}
            {...props}
        >
            {children}
        </div>
    )
)
Sheet.displayName = "Sheet"

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
    ({ className, onClick, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
            )}
            onClick={onClick}
            {...props}
        />
    )
)
SheetOverlay.displayName = "SheetOverlay"

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
    ({ children, className, onClose, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-background shadow-lg transition-transform duration-300 ease-in-out transform-gpu will-change-transform",
                className
            )}
            style={{
                transform: 'translateZ(0)', // Force hardware acceleration
                backfaceVisibility: 'hidden', // Prevent flickering
            }}
            {...props}
        >
            {children}
        </div>
    )
)
SheetContent.displayName = "SheetContent"

export { Sheet, SheetOverlay, SheetContent }
