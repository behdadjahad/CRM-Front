import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import CustomerExpensesOverview from "./customer-expenses-overview";
import CustomerTableContainer from "./customer-table-container";

export default function CustomerTabContent() {
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const expenses = [
    {
      label: "هزینه",
      value: "575000000",
    },
    {
      label: "درآمد",
      value: "42500000",
    },
    {
      label: "سود و زیان",
      value: "13000000",
    },
  ];
  const tableHeaderLabels = [
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
  const subCustomerInfoLabels = [
    "ضررو زیان",
    "تعداد مشتری",
    "تاریخ آخرین پیگیری",
    "نوع آخرین پیگیری",
    "وضعیت آخرین پیگیری",
    "پیگیری بعدی",
    "رضایتمندی",
  ];
  const customers = [
    {
      Info: {
        "نام ونام خانوادگی": "فرهاد امینی",
        "کدملی": "2289785004",
        "ایمیل": "Frahad2018@gmail.com",
        "شماره تماس": "09177895236",
        "شغل": "طراح",
        "موضوع قرارداد": "رزرو هتل- آنتالیا",
        "رتبه مشتری": "نقره ای",
        "قرارداد": "۱۴۰۳/۲/۶  ۲۱:۱۵",
        "مبلغ آخرین قرارداد": "۱۵٬۰۰۰٬۰۰۰٬۰۰۰ تومان",
      },
      subInfo: {
        "ضررو زیان": "42٬۰۰۰٬۰۰۰ تومان",
        "تعداد مشتری": "4",
        "تاریخ آخرین پیگیری": "۱۴۰۳/۲/۶  ۲۱:۱۵",
        "نوع آخرین پیگیری": "جلسه حضوری",
        "وضعیت آخرین پیگیری": "برنامه‌ریزی‌شده",
        "پیگیری بعدی": "۱۴۰۳/4/12  11:00",
        "رضایتمندی": "3/10",
      },
    },
    {
      Info: {
        "نام ونام خانوادگی": "سارا سهامی",
        "کدملی": "2282530936",
        "ایمیل": "Sara_saha@gmail.com",
        "شماره تماس": "09177895236",
        "شغل": "معمار",
        "موضوع قرارداد": "تور گردشگری",
        "رتبه مشتری": "طلایی",
        "قرارداد": "۱۴۰۳/۲/۶  ۲۱:۱۵",
        "مبلغ آخرین قرارداد": "۱۵٬۰۰۰٬۰۰۰٬۰۰۰ تومان",
      },
      subInfo: {
        "ضررو زیان": "42٬۰۰۰٬۰۰۰ تومان",
        "تعداد مشتری": "4",
        "تاریخ آخرین پیگیری": "۱۴۰۳/۲/۶  ۲۱:۱۵",
        "نوع آخرین پیگیری": "جلسه حضوری",
        "وضعیت آخرین پیگیری": "برنامه‌ریزی‌شده",
        "پیگیری بعدی": "۱۴۰۳/4/12  11:00",
       "رضایتمندی": "3/10",
      },
    },
  ];
  return (
    <div>
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
        <FormMaker
          form={customerSearchFormik}
          fields={[
            {
              key: "clientKeyWord",
              component: "input",
              icon: "/icons/search-icon.png",
              type: "text",
              placeholder:
                "جستجوی پیشرفته مشتری بر اساس نام, نام خانوادگی و...",
              className: "rounded-md h-12 p-0 w-1/2",
            },
          ]}
          className="w-full"
        />
        <div className="w-full">
          {" "}
          <CustomerExpensesOverview list={expenses} />
        </div>
      </div>
      <CustomerTableContainer
        tableHeaderLabels={tableHeaderLabels}
        customers={customers}
        subCustomerInfoLabels={subCustomerInfoLabels}
      />
    </div>
  );
}
