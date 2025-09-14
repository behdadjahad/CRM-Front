"use client";

import { useEffect, useState } from "react";
import CustomerDetailTable from "./customer-detail-table";
import ReactPaginate from "react-paginate";
import CustomerDetailContractContainer from "./customer-detail-contract-container";

// import dynamic from "next/dynamic"; // Only if you're using Next.js
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  fetchAllCustomerDetailContract,
  fetchCustomerDetailContract,
} from "@/store/customer-detail-contract-slice";
import { limitForCustomerDetailContracts } from "@/lib/utils";
import { CustomerPersonalInfo } from "./customer-personal-info";

import ExportDataContainer from "../shared/export-data-container";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { usePageData } from "@/hooks/usePageData";
import { AccessDenied } from "../shared/AccessDenied";
import Image from "next/image";
// const ReactPaginate = dynamic(() => import('react-paginate'), { ssr: false });
export default function CustomerDetailContent({
  tabList,
}: {
  tabList: string[];
}) {
  const dispatch = useDispatch<any>();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const pageFeatures = usePageData();
  console.log("single-customer", pageFeatures)
  const customerContractHeaderLabels = [
    "ردیف",
    "شماره قرارداد",
    "تاریخ قرارداد",
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
  const customerContractCardLabels = [
    { label: "شماره قرارداد", labelIsHidden: false },
    { label: "تاریخ قرارداد", labelIsHidden: false },
    { label: "میزان درآمد", labelIsHidden: false },
    { label: "سود و زیان", labelIsHidden: false },
    { label: "مقصد", labelIsHidden: true },
    { label: "موضوع قرارداد", labelIsHidden: true },
    { label: "اپراتور", labelIsHidden: false },
    { label: "وضعیت", labelIsHidden: false },
    { label: "تاریخ شروع", labelIsHidden: false },
    { label: "تاریخ پایان", labelIsHidden: false },
    { label: "تعداد مشتری", labelIsHidden: false },
    { label: "رضایتمندی", labelIsHidden: false },
  ];

  const servicesReportData = [
    {
      label: "هتل",
      value: 48,
      valueInPercent: 90,
      chartFillColor: "#FEC53D",
      chartPathColor: "#FFFCF6",

      icon: "/icons/hotel-report.png",
      iconClassName: "w-6 h-6",
    },
    {
      label: "ویزا",
      value: 13,
      valueInPercent: 90,
      chartFillColor: "#4AD991",
      chartPathColor: "#DFF7EB",
      icon: "/icons/visa-report.png",
      iconClassName: "w-4 h-6",
    },
    {
      label: "پرواز",
      value: 21,
      valueInPercent: 10,
      chartFillColor: "#FF9771",
      chartPathColor: "#FFF0EB",
      icon: "/icons/flight-report.png",
      iconClassName: "w-8 h-6",
    },
    {
      label: "تورداخلی",
      value: 48,
      valueInPercent: 85,
      chartFillColor: "#6BA9EF",
      chartPathColor: "#E8F3FF",
      icon: "/icons/suit-case-report.png",
      iconClassName: "w-4 h-6",
    },
    {
      label: "سایر",
      value: 13,
      valueInPercent: 27,
      chartFillColor: "#8280FF",
      chartPathColor: "#D0CFFF",
      icon: "/icons/other-report.png",
      iconClassName: "w-6 h-2",
    },
  ];
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;

    dispatch(
      fetchCustomerDetailContract({
        page: selectedPage,
        limit: limitForCustomerDetailContracts,
        id: id,
        filters: {},
      })
    );
  };
  useEffect(() => {
    dispatch(
      fetchCustomerDetailContract({
        page: 1,
        limit: limitForCustomerDetailContracts,
        id: id,
        filters: {},
      })
    );
  }, [dispatch]);
  const customerContracts = useSelector(
    (state: any) => state.customerDetailContract.items
  );
  const allItems = useSelector(
    (state: any) => state.customerDetailContract.allItems
  );
  const checkedItems = useSelector(
    (state: any) => state.customerDetailContract.checkedItems
  );
  const pages = useSelector(
    (state: any) => state.customerDetailContract.totalPages
  );
  const total = useSelector((state: any) => state.customerDetailContract.total);
  const dateTimeRange = useSelector((state: any) => state.customerDetailContract.dateTimeRange);
  const filters = useSelector(
    (state: any) => state.customerDetailContract.filters
  );
  const [isLoading, setIsLoading] = useState(false);

  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        fetchAllCustomerDetailContract({
          page: 1,
          limit: total,
          id: id,
          filters: filters,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="bg-card w-full mt-0 flex gap-1 md:gap-4">
        {tabList.map((tab: any) => (
          <button
            key={tab}
            className={`text-center text-xs font-bold md:text-sm h-full p-2 md:p-6 ${activeTab === tab
              ? "border-b-2 border-quartiery-background font-bold text-black"
              : "text-neutral-500"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      {activeTab === "قراردادها" && (
        <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow mt-6 gap-4">
          <div className="flex justify-between items-center">
            <div>فیلتر</div>
            {generateFeatureAccess(pageFeatures, "export-customer-contracts")?.show && generateFeatureAccess(pageFeatures, "export-customer-contracts")?.enable && (
              <ExportDataContainer
                headerLabels={customerContractHeaderLabels}
                list={allItems}
                onGetData={getDataHandler}
                loading={isLoading}
                checkedItems={checkedItems}
                dateTimeRange={dateTimeRange}
              />
            )}
            {generateFeatureAccess(pageFeatures, "export-customer-contracts")?.show && !generateFeatureAccess(pageFeatures, "export-customer-contracts")?.enable && (
              <AccessDenied
                variant={""}
                title="خروجی "
                message="شما به این بخش دسترسی ندارید"
                icon={(<Image
                  src={"/icons/disable-download.png"}
                  alt="edit"
                  width={1024}
                  height={1024}
                  className="w-4 h-4"
                />)}
              />
            )}

          </div>

          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-white">
            {activeTab}
          </div>

          <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
            <CustomerDetailTable
              tableHeaderLabels={customerContractHeaderLabels}
              list={customerContracts}
              className="hidden xl:flex"
            />
            <CustomerDetailContractContainer
              className="flex items-center justify-center xl:hidden"
              list={customerContracts}
              labels={customerContractCardLabels}
            />
            {pages > 1 && (
              <div className="w-full mt-4">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="صفحه بعد"
                  previousLabel="صفحه قبل"
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={3}
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
            )}
          </div>
        </div>
      )}
      {/* {activeTab === "آماروگزارش ها" && (
        <CustomerDetailReport serviceData={servicesReportData} />
      )} */}
      {activeTab === "اطلاعات شخصی" && <CustomerPersonalInfo />}
    </>
  );
}
