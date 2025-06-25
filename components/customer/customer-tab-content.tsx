import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
// import CustomerExpensesOverview from "./customer-expenses-overview";
//import CustomerTableContainer from "./customer-table-container";
import ReactPaginate from "react-paginate";

import { fetchCustomers } from "@/store/customer-slice";
import { useDispatch, useSelector } from "react-redux";
import { limitForCustomers } from "@/lib/utils";
import CustomerTableContainer from "./customer-table-container";
import CustomerContainer from "./customer-container";
import ExportDataContainer from "../shared/export-data-container";

export default function CustomerTabContent({
  customerList,
}: {
  customerList: any[];
}) {
  const dispatch = useDispatch<any>();
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });

  const pages = useSelector((state: any) => state.customer.totalPages);
  const currentPage = useSelector((state: any) => state.customer.currentPage);
  const filters = useSelector((state: any) => state.customer.filters);

  // const expenses = [
  //   {
  //     label: "هزینه",
  //     value: "575000000",
  //   },
  //   {
  //     label: "درآمد",
  //     value: "42500000",
  //   },
  //   {
  //     label: "سود و زیان",
  //     value: "13000000",
  //   },
  // ];
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
  const customerCardLabels = [
    { label: "نام ونام خانوادگی", labelIsHidden: true },
    { label: "رتبه مشتری", labelIsHidden: true },
    { label: "ایمیل", labelIsHidden: true },
    { label: "شماره تماس", labelIsHidden: true },
    { label: "شغل", labelIsHidden: true },
    { label: "موضوع قرارداد", labelIsHidden: true },
    { label: "کدملی", labelIsHidden: false },

    { label: "مبلغ آخرین قرارداد", labelIsHidden: false },
  ];
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchCustomers({
        page: selectedPage,
        limit: limitForCustomers,
        filters: filters,
      })
    );
  };
  function searchSubmitHandler() {
    const searchValue = customerSearchFormik.values.clientKeyWord;
    dispatch(
      fetchCustomers({
        page: 1,
        limit: limitForCustomers,
        filters: {
          searchText: searchValue,
        },
      })
    );
  }
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
              onClick: searchSubmitHandler,
            },
          ]}
          className="w-full"
        />
        {/* <div className="w-full">
          {" "}
          <CustomerExpensesOverview list={expenses} />
        </div> */}
      </div>
      <CustomerTableContainer
        tableHeaderLabels={tableHeaderLabels}
        customers={customerList}
        className="hidden xl:flex"
        // className="hidden"
      />
      <CustomerContainer
        className="flex items-center justify-center xl:hidden"
        customers={customerList?.map((item: any) => ({
          id: item.id,
          info: item.info,
        }))}
        labels={customerCardLabels}
      />
      <div className="w-full mt-4">
        <ReactPaginate
          breakLabel="..."
          nextLabel="صفحه بعد"
          previousLabel="صفحه قبل"
          onPageChange={handlePageChange}
          pageRangeDisplayed={2}
          marginPagesDisplayed={3}
          forcePage={currentPage - 1}
          pageCount={pages}
          renderOnZeroPageCount={null}
          containerClassName="w-full relative flex justify-center items-center ltr"
          pageClassName="mx-3 rounded-md"
          pageLinkClassName="rounded-md text-sm hover:bg-gray-100  w-10 h-10 flex items-center justify-center"
          activeClassName="bg-gray-100 rounded-md"
          previousClassName="absolute right-8"
          previousLinkClassName="rounded-md text-sm"
          nextClassName="absolute left-8"
          nextLinkClassName="rounded-md text-sm"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
