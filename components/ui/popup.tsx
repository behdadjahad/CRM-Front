'use client'
import { ReactNode } from "react";

interface PopupInterface {
  children: ReactNode;
}

export default function PopUp({ children }: PopupInterface) {
  return (
    <div className="relative z-[9999]">
      <div className="absolute left-0 top-0 bg-card p-3 rounded-xl custom-shadow transition-all duration-300 ease-in-out">{children}</div>
    </div>
  );
}
