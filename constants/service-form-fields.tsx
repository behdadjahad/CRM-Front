import { FormMakerInterface } from "@/components/shared/form-maker";

export const purchaseInfo: FormMakerInterface["fields"] = [
  {
    key: "costPerNight",
    component: "input",
    placeholder: "هرشب اقامت",
    type: "text",
    floating: true,
    className: "w-full md:w-1/2 lg:w-1/4",
  },
  {
    key: "currency",
    component: "input",
    placeholder: "ارز هزینه",
    type: "text",
    floating: true,
    className: "w-full md:w-1/2 lg:w-1/4",
  },
  {
    key: "broker",
    component: "Select",
    placeholder: "کارگزار",
    type: "text",
    floating: true,
    className: "w-full md:w-1/2",
  },
];
export const recorderInfo: FormMakerInterface["fields"] = [
  {
    key: "Registrar",
    component: "input",
    placeholder: "ثبت کننده",
    type: "text",
    floating: true,
    className: "w-full md:w-1/2 lg:w-1/3",
  },
  {
    key: "receptionist",
    component: "Select",
    placeholder: "مسئول قرارداد",
    type: "text",
    floating: true,
    className: "w-full md:w-1/2 lg:w-1/3",
  },
  {
    key: "explanation",
    component: "input",
    placeholder: "توضیحات",
    type: "text",
    floating: true,
    className: "w-full",
  },
];
