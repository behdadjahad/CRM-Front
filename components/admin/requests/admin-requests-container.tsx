"use client";

import React from "react";
import { Request, RequestStatus } from "@/types/requests";
import AdminRequestsTable from "./admin-requests-table";
import FilterContainer from "@/components/section/filter-container";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";
import {
  FILTER_ITEMS,
  RANGE_ITEMS,
  SORT_OPTIONS,
} from "@/constants/invoice-constants";

interface AdminRequestsContainerProps {
  requests: Request[];
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  onViewDetails: (invoiceId: string) => void;
}

const AdminRequestsContainer: React.FC<AdminRequestsContainerProps> = ({
  requests,
  onStatusChange,
  onViewDetails,
}) => {
  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      status: "",
      amountFrom: "",
      amountTo: "",
      dateFrom: "",
      dateTo: "",
    },
    onSubmit: async () => {},
  });

  const filterItems = FILTER_ITEMS.map((item) => ({
    ...item,
    component: (
      <FormMaker
        form={formik}
        fields={[item.component(formik)]}
        className="flex flex-row w-full"
      />
    ),
  }));

  const rangeItems = RANGE_ITEMS.map((item) => ({
    ...item,
    component: (
      <FormMaker
        form={formik}
        fields={item.component(formik)}
        className="flex flex-row w-full"
      />
    ),
  }));

  const submitFilter = () => {
    // Filter is already applied through useMemo
    console.log("Filter applied:", formik.values);
  };

  const cancelFilter = () => {
    formik.resetForm();
  };

  const submitSort = (itemValue: string, type?: string) => {
    // Sorting can be implemented here if needed
    console.log("Sort applied:", itemValue, type);
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <FilterContainer
            onFilterHandler={submitFilter}
            rangeItems={rangeItems}
            filterItems={filterItems}
            sortList={SORT_OPTIONS}
            onCancleHandler={cancelFilter}
            onSortHandler={submitSort}
          />
          {/* <ExportDataContainer
            headerLabels={leadHeaderLabels}
            list={allItems}
            onGetData={getDataHandler}
            loading={isLoading}
            checkedItems={checkedItems}
            dateTimeRange={dateTimeRange}
          /> */}
          <></>
        </div>
        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
            <FormMaker
              form={formik}
              fields={[
                {
                  key: "searchTerm",
                  component: "input",
                  icon: "/icons/search-icon.png",
                  type: "text",
                  placeholder:
                    "جستجو بر اساس شماره فاکتور، نام کاربر یا پکیج...",
                  className: "rounded-md h-12 p-0 w-full",
                },
              ]}
              className="w-full"
            />
          </div>
          <AdminRequestsTable
            requests={requests}
            onStatusChange={onStatusChange}
            onViewDetails={onViewDetails}
                  />
                  
        </div>
      </div>
    </div>
  );
};

export default AdminRequestsContainer;
