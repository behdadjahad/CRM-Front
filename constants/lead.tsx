import { LeadViewType } from "@/components/lead/LeadContainer";

export interface leadViewOptionsInterface {
  label: LeadViewType;
  icon: string;
}

export const leadViewOptions: leadViewOptionsInterface[] = [
  { label: "pipe", icon: "/icons/pipe-icon.svg" },
  { label: "table", icon: "/icons/table-icon.svg" },
];
