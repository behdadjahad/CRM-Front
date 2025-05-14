import { type ClassValue, clsx } from "clsx";
import { title } from "process";
import { twMerge } from "tailwind-merge";

export const REQUIRED_TEXT = "این فیلد ضروری است";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceString: any) {
  const price = priceString.toString();
  return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const totalVotes = 10;
export const limitForCustomers = 6;
export const limitForContracts = 6;
export const dateType = "Solar";
export const customerSatisfactionTarget = 10;
export const limitForCustomerDetailContracts = 6;
export const priceOptions = Array.from({ length: 11 }, (_, i) => {
  const value = (i * 10000000).toString(); // string value
  return {
    label: `${i * 10} میلیون تومان`, // display label
    value, // string value
  };
});
export function cleanObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  );
}
export const ServerImageAddress = "http://185.126.203.246:3000/public/";
export const customerRank = [
  {
    label: "طلایی",
    value: "Gold",
    className: "bg-[#FFFAEB] text-[#FDB022] border-[#FDB022]",
  },
  {
    label: "نقره ای",
    value: "Silver",
    className: "bg-[#F3F2F2] text-[#919EAB] border-[#919EAB]",
  },
  {
    label: "برنز",
    value: "Bronze",
    className: "bg-[#FFD700] text-[#B55D04] border-[#B55D04]",
  },
];
