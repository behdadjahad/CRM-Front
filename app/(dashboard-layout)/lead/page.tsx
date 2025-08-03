import LeadContainer from "@/components/lead/lead-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Lead() {
  const leadList = [
    {
      id: 1,
      list: [
        {
          label: "نام و نام خانوادگی",
          value: "مینا فرجاد",
        },
        {
          label: "ایمیل",
          value: "MinaFarjad@gmail.com",
        },
        {
          label: "شماره تماس",
          value: "۰۹۱۷۷۸۹۵۲۳۶",
        },
        {
          label: "نوع درخواست",
          value: "تور داخلی",
        },
        {
          label: "ثبت درخواست",
          value: "ایمیل",
        },
        {
          label: "وضعیت",
          value: "از دست رفته",
        },
        {
          label: "آخرین پیگیری توسط",
          value: "۱۴۰4/1/16",
        },

        {
          label: "مسئول پیگیری",
          value: "سیما احدی",
        },
        {
          label: "زمان ثبت درخواست",
          value: "۱۴۰4/1/16",
        },
      ],
    },
  ];
  return (
    <main className="flex flex-col">
      <Title label="درخواست ها" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "درخواست ها",
          },
        ]}
      />

      <LeadContainer leadList={leadList} />
    </main>
  );
}
