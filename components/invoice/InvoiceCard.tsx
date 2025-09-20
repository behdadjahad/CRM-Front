import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import InvoicePreview from "./InvoicePreview";
export interface InvoiceCardInterface {
  id: number;
  title: {
    label: string;
    value: string;
  };
  invoiceNumber: {
    label: string;
    value: string;
  };
  description: {
    label: string;
    value: string;
  };
  paymentDates: { label: string; value: string }[];
  status: { label: string; className?: string };
  price: { amount: string; currency: string };
  actions: { label: string; icon: string }[];
}

export default function InvoiceCard({
  id,
  title,
  description,
  paymentDates,
  status,
  price,
  actions,
  invoiceNumber,
}: InvoiceCardInterface) {
  return (
    <Link href={`invoice-detail/${id}`}>
      <div className="custom-shadow p-4 w-full bg-card rounded-lg">
        <div className="flex justify-between flex-row-reverse">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-row-reverse gap-2">
                <span>: {title.label}</span>
                <span>{title.value}</span>
              </div>
              <div className="flex flex-row-reverse gap-2">
                <span> : {invoiceNumber?.label}</span>
                <span>{invoiceNumber?.value}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 flex gap-2 flex-row-reverse">
              <span> : {description?.label}</span>
              <span>{description?.value}</span>
            </div>
            <div className="flex gap-4 flex-wrap text-sm text-gray-500 flex-row-reverse">
              {paymentDates?.map((item) => (
                <div key={item?.label} className="flex gap-2 flex-row-reverse">
                  <span>:{item?.label}</span>
                  <span>{item?.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <div className={status?.className}>{status?.label}</div>
            <div className="text-[#717680]">
              <span>{price?.currency}</span>
              <span>{price?.amount}</span>
            </div>
            <div className="flex gap-2">
              {/* {actions?.map((action, index) => (
                <Button
                  key={`action-${index}`}
                  className="border border-[#212B36] text-[#212B36] rounded-xl font-thin px-2 py-1"
                >
                  <Image
                    src={action?.icon}
                    alt="actions"
                    width={1024}
                    height={1024}
                    className="w-4 h-4"
                  />
                  <span>{action?.label}</span>
                </Button>
              ))} */}
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
