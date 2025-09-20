"use client";
import InvoiceContainer from "@/components/invoice/InvoiceContainer";
import Breadcrumb from "@/components/shared/breadcrumb";
import ExportDataContainer from "@/components/shared/export-data-container";
import Title from "@/components/shared/title";
import {
  invoiceHeaderLabels,
  paymantStatusOptions,
} from "@/constants/invoice-constants";
import { RootState } from "@/store";
import { fetchAllInvoices } from "@/store/invoice-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Invoice() {
  const dispatch = useDispatch<any>();
  const [isLoading, setIsLoading] = useState(false);
  const total = useSelector((state: any) => state.invoice.total);
  const filters = useSelector((state: any) => state.invoice.filters);
  const allItems = useSelector((state: any) => state.invoice.allItems);
  const checkedItems = useSelector((state: any) => state.invoice.checkedItems);
  const dateTimeRange = useSelector(
    (state: any) => state.invoice.dateTimeRange
  );
  const chadcoCustomerId = useSelector(
    (state: RootState) => state.login.chadcoCustomerId
  );

  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        fetchAllInvoices({
          chadcoCustomerId: chadcoCustomerId,
          page: 1,
          limit: total,
          filters: filters,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="flex items-center justify-between">
        <div>
          <Title label="فاکتورها" />

          <Breadcrumb
            list={[
              {
                label: "کاربر",
                link: "/",
              },
              {
                label: "صورتحساب",
              },
            ]}
          />
        </div>
        <ExportDataContainer
          headerLabels={invoiceHeaderLabels}
          list={allItems}
          onGetData={getDataHandler}
          loading={isLoading}
          checkedItems={checkedItems}
          dateTimeRange={dateTimeRange}
        />
      </div>
      <InvoiceContainer
        tabList={paymantStatusOptions}
        defaultValue={paymantStatusOptions[0]}
      />
    </main>
  );
}
