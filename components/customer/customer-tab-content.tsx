import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import CustomerExpensesOverview from "./customer-expenses-overview";
import CustomerTableContainer from "./customer-table-container";
import ReactPaginate from "react-paginate";
import {
  customerSatisfactionTarget,
  dateType,
  formatPrice,
  limitForCustomers,
} from "@/lib/utils";
import { getCustomers } from "@/api/customer";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertDate } from "@/lib/date";
export default function CustomerTabContent() {
  const [customerList, setCustomerList] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const transformCustomers = (customers: any[]) => {
    return customers?.map((item: any) => ({
      Info: {
        "نام ونام خانوادگی": item?.person?.fullName,
        کدملی: item?.person?.idNumber,
        ایمیل: item?.email[0]?.email,
        "شماره تماس": item?.phone[0]?.number,
        شغل: item?.person?.personJobs?.[0]?.jobs?.name,
        "موضوع قرارداد": item?.lastContract?.contractType,
        "رتبه مشتری": "نقره ای",
        قرارداد: convertDate(item?.lastContract?.submitDate, dateType),
        "مبلغ آخرین قرارداد": `${item?.lastContract?.price}`,
      },
      subInfo: {
        [item?.profit < 0 ? "ضرر و زیان" : "سود"]: formatPrice(Math.abs(item?.profit)),
        "تعداد مشتری": item?.totalPeopleInContracts,
        "تاریخ آخرین پیگیری": "۱۴۰۳/۲/۶  ۲۱:۱۵",
        "نوع آخرین پیگیری": "جلسه حضوری",
        "وضعیت آخرین پیگیری": "برنامه‌ریزی‌شده",
        "پیگیری بعدی": "۱۴۰۳/4/12  11:00",
        رضایتمندی: `${customerSatisfactionTarget}/${item.score}`,
      },
    }));
  };
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await getCustomers(1, limitForCustomers),
  });

  useEffect(() => {
    if (customers) {
      console.log(customers);
      const list = transformCustomers(customers?.data);
      setCustomerList(list);
      const totalItems = customers?.pagination?.total;
      const totalPages = Math.ceil(totalItems / limitForCustomers);
      setTotalPages(totalPages); 
    }
  }, [customers]);

  const { mutate: customerPageHandler } = useMutation({
    mutationFn: (page: number) => getCustomers(page, limitForCustomers),
    onSuccess: (data) => {
      const list = transformCustomers(data.data);
      setCustomerList(list);
    },
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
  const handlePageChange = (selectedItem: any) => {
    const page = selectedItem.selected + 1; 
    customerPageHandler(page)
    //const result = await getCustomers(page, limitForCustomers);

    // You can use the page number to fetch data or update state
  };

  return (
    <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
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
        customers={customerList}
        //subCustomerInfoLabels={subCustomerInfoLabels}
      />
      <div className="w-full">
        <ReactPaginate
          breakLabel="..."
          nextLabel="بعدی"
          previousLabel="قبلی"
          onPageChange={handlePageChange}
          pageRangeDisplayed={2}
          marginPagesDisplayed={3}
          pageCount={totalPages}
          renderOnZeroPageCount={null}
          containerClassName="w-full relative flex justify-center items-center mt-auto ltr"
          pageClassName="mx-3"
          pageLinkClassName="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
          activeClassName="bg-blue-600 text-white font-bold"
          previousClassName="absolute right-8"
          previousLinkClassName="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
          nextClassName="absolute left-8"
          nextLinkClassName="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
