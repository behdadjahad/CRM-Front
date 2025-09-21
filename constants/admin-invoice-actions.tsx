import { ActionType } from "@/components/admin/requests/admin-requests-table";

export interface AdminInvoiceActionListInterface {
  label: string;
  value: string;
  actionType: ActionType;
}

export const adminInvoiceActionList: AdminInvoiceActionListInterface[] = [
  {
    label: "قبول کردن",
    value: "accept",
    actionType: "Accept",
  },
  {
    label: "رد کردن",
    value: "reject",
    actionType: "Reject",
  },
  {
    label: "اعمال تخفیف",
    value: "discount",
    actionType: "Discount",
    
  },
];
