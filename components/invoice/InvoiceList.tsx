import InvoiceCard from "./InvoiceCard";

export interface InvoiceListInterface {
  data: {
    id: number;
    title: {label: string; value: string};
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
  }[];
}

export default function InvoiceList({ data }: InvoiceListInterface) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {data?.map((invoice, index) => (
        <InvoiceCard key={`invoice-${index}`} {...invoice} />
      ))}
    </div>
  );
}
