"use client";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
export function usePageCode() {
  const pathname = usePathname();
  const dispatch = useDispatch();

}
