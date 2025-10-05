import { LeadViewType } from "@/components/lead/LeadContainer";

export interface leadViewOptionsInterface {
  label: LeadViewType;
  icon: string;
}

export const leadViewOptions: leadViewOptionsInterface[] = [
  { label: "pipe", icon: "/icons/pipe-icon.svg" },
  { label: "table", icon: "/icons/table-icon.svg" },
];
export const leadFollowUpTypeList = [{
    label: "تماس",
    value: "call",
    icon:"/icons/foreground-phone-icon.svg"
},{
    label: "پیامک",
    value: "sms",
    icon:"/icons/foreground-sms-icon.svg"
},{
    label: "ایمیل",
    value: "email",
    icon:"/icons/foreground-email-icon.svg"
},{
    label: "جلسه",
    value: "meet",
    icon:"/icons/foreground-meet-icon.svg"
},{
    label: "VOIP",
    value: "VOIP",
    icon:"/icons/foreground-voip-icon.svg"
},]