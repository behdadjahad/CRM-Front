"use client";

import CustomerDetailTable from "./customer-detail-table";
import ReactPaginate from "react-paginate";
// import dynamic from "next/dynamic"; // Only if you're using Next.js

// const ReactPaginate = dynamic(() => import('react-paginate'), { ssr: false });
export default function CustomerDetailContent() {
  const customerContractHeaderLabels = [
    "میزان درآمد",
    "سود و زیان",
    "مقصد",
    "موضوع قرارداد",
    "اپراتور",
    "وضعیت",
    "تاریخ شروع",
    "تاریخ پایان",
    "تعداد مشتری",
    "رضایتمندی",
  ];
  const customerContracts = {
    title: "قراردادها",
    list: [
      {
        "میزان درآمد": "15000000000",
        "سود و زیان": "9000000",
        مقصد: "ارمنستان",
        "موضوع قرارداد": "ویزا",
        اپراتور: "علی بازرگان",
        وضعیت: "فعال",
        "تاریخ شروع": "1403/02/06",
        "تاریخ پایان": "1403/01/16",
        "تعداد مشتری": "147",
        رضایتمندی: 0.8,
      },
    ],
  };
  //   const handlePageChange = (selectedItem: any) => {
  //     // const selectedPage = selectedItem.selected + 1;
  //     console.log(selectedItem);
  //     // dispatch(
  //     //   fetchCustomers({
  //     //     page: selectedPage,
  //     //     limit: limitForCustomers,
  //     //     filters: filters,
  //     //   })
  //     // );
  //   };
  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow">
    <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-white">{customerContracts.title}</div>
      <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
        <CustomerDetailTable
          tableHeaderLabels={customerContractHeaderLabels}
          list={customerContracts.list}
    
        />
        <div className="w-full mt-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel="صفحه بعد"
            previousLabel="صفحه قبل"
            onPageChange={() => {}}
            pageRangeDisplayed={2}
            marginPagesDisplayed={3}
            pageCount={10}
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
    </div>
  );
}
