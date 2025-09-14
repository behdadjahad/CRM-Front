"use client";
import InvoiceContainer from "@/components/invoice/InvoiceContainer";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Invoice() {
  return (
    <main>
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
      <InvoiceContainer
        tabList={[
          { label: "همه", value: "All" },
          { label: "درانتظار تایید", value: "pending-confirm" },
          { label: "درانتظار پرداخت", value: "pending-paid" },
          { label: "پرداخت نشده", value: "unpaid" },
          { label: "پرداخت شده", value: "paid" },
        ]}
        defaultValue={{ label: "همه", value: "All" }}
      />
    </main>
  );
}
