import LeadPipeContainer from "./LeadPipeContainer";

export interface LeadContainerInterface {
  className?: string;
}
export interface PipeInterface {
  title: string;
  leadList: any[];
  overal: {
    label: string;
    value: string;
  }[];
}
export const leadPipeList = [
  {
    title: "ایجاد شده",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
  {
    title: "درجریان",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
  {
    title: "پیگیری",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },

        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
];
export default function LeadContainer() {
  return (
    <div className="flex flex-col">
      {/* <div>lead container</div> */}
      <LeadPipeContainer pipeList={leadPipeList} />
    </div>
  );
}
