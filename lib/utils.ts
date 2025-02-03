import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const REQUIRED_TEXT = "این فیلد ضروری است";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceString: any) {
  const price = priceString.toString();
  return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
