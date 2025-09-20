import { type ClassValue, clsx } from "clsx";
import { pick } from "lodash";
import { title } from "process";
import { twMerge } from "tailwind-merge";

export const REQUIRED_TEXT = "این فیلد ضروری است";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceString: any) {
  const price = priceString?.toString();
  return price?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function cleanFormatPrice(priceString: any) {
  const price = priceString?.toString();
  return Number(price.replace(/,/g, ""));
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

export enum ContractState {
  INPROGRESS = "فعال",
}
export function getDateRange(monthsAgo: number): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const endDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  );
  const startDate = new Date(endDate);
  startDate.setUTCMonth(startDate.getUTCMonth() - monthsAgo);

  const formatDate = (date: Date): string =>
    date.toISOString().split(".")[0] + "Z";

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
export const subContracts = {
  flight: "پرواز",
  visa: "ویزا",
  pickUp: "پیکاپ",
  embassyPackage: "سفارت",
  ensurance: "بیمه",
  accommodation: "هتل",
  other: "سایر",
};
export const contractType = {
  accommodationContract: "هتل",
  otherContract: "سایر",
  visaContract: "ویزا",
  ticketContract: "پرواز",
  embassyPackageContract: "سفارت",
  ensuranceContract: "بیمه",
  pickUpContract: "پیکاپ",
};
export const avServices = {
  Visa: "ویزا",
  Pickup: "پیکاپ",
  Other: "سایر",
  Ensurance: "بیمه",
  Accommodation: "هتل",
  Embassy: "سفارت",
  Flight: "پرواز",
};
export const colors = [
  "#E9EDF0",
  "#FAD89E",
  "#A0AFFD",
  "#8CDAAA",
  "#FFDA44",
  "#E94B5C",
  "#6993FF",
];

let shuffled: any[] = [];
let index = 0;

function shuffle(array: any) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomColor(colors: string[]) {
  if (index === 0 || index >= shuffled.length) {
    shuffled = shuffle(colors);
    index = 0;
  }
  return shuffled[index++];
}

export const kpiType = {
  passengers: "مشتری",
  contract: "قرارداد",
  profit: "سود",
  sellPrice: "فروش",
};
export const limitForInfiniteCustomers = 8;
export const activeFilterTime = 6;
export const limitForStations = 6;
export const limitForHotels = 6;
export const limitForAirlines = 6;
export const limitForNotifications = 6;
export const limitForDrawerNotifications = 8;
export const limitForLeads = 6;
export const limitForAdminInvoices = 6;
export function buildRowOptions(total: number, chunkSize: number) {
  if (!total) return [];
  const result = [];
  for (let i = chunkSize; i <= total; i += chunkSize) {
    result.push({
      value: i.toString(),
      label: `${i}ردیف`,
    });
  }
  return result;
}
export const contractHeaderLabels = [
  "ردیف",
  "تاریخ قرارداد",
  "مقصد",
  "ثبت کننده",
  "مشتری",
  "نوع قرارداد",
  "رضایتمندی",
];
export const customerHeaderLabels = [
  "ردیف",
  "نام ونام خانوادگی",
  "کدملی",
  "ایمیل",
  "شماره تماس",
  "شغل",
  "موضوع قرارداد",
  "رتبه مشتری",
  "قرارداد",
  "مبلغ آخرین قرارداد",
];
export enum notificationStatus {
  all = "ALL",
  read = "READ",
  unread = "UNREAD",
}
export enum notificationEntityName {
  flight = "FLIGHT",
  contract = "CONTRACT",
  customer = "CUSTOMER",
}
export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}
export const getSortFieldFromLabel = (label: string): string | undefined => {

  const labelToFieldMap: Record<string, string> = {
    "نام و نام خانوادگی": "customer.person.lastName",
    "نوع درخواست": "leadType.title",
    "علاقه مندی": "temperature",
    وضعیت: "status",
   "وضعیت سفارش": "paymentStatus",
  };

  return labelToFieldMap[label.trim()];
};
export const leadHeaderLabels = [
  "نام و نام خانوادگی",
  "نوع درخواست",
  "علاقه مندی",
  "وضعیت",
  "ایمیل",
  "شماره تماس"
];
export enum Temperature {
  WARM = "گرم",
  COLD = "سرد",
  HOT = "داغ",
}
export function getTemperatureLabel(value: string): string {
  return Temperature[value as keyof typeof Temperature] ?? value;
}
enum LeadStatus {
  INITIAL = "ایجاد شده",
  INPROGRESS = "درجریان",

  CONTRACTED = "تبدیل شد به قرارداد",
  FAILED = "ازدست رفته",
}
export function getLeadStatusLabel(value: string): string {
  return LeadStatus[value as keyof typeof LeadStatus] ?? value;
}
