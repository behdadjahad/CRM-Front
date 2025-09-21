"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
    children: React.ReactNode
    className?: string
}

interface DialogContentProps {
    children: React.ReactNode
    className?: string
    onClose?: () => void
}

interface DialogOverlayProps {
    className?: string
    onClick?: () => void
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
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
Dialog.displayName = "Dialog"

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
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
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ children, className, onClose, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
DialogContent.displayName = "DialogContent"

export { Dialog, DialogOverlay, DialogContent }




