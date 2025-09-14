import InvoiceCard from "./InvoiceCard";

export interface InvoiceListInterface {
  data: {
    title: string;
    description: string;
    paymentDates: { label: string; value: string }[];
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
