import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
export interface InvoiceCardInterface {
  id: number;
  title: string;
  description: string;
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
}: InvoiceCardInterface) {
  return (
    <Link href={`invoice-detail/${id}`}>
    <div className="custom-shadow p-4 w-full bg-card rounded-lg">
      <div className="flex justify-between flex-row-reverse">
        <div className="flex flex-col gap-2">
          <div>{title}</div>
          <div>{description}</div>
          <div className="flex gap-4 flex-wrap">
            {paymentDates.map((item) => (
              <div key={item.label} className="flex gap-2 flex-row-reverse">
                <span>:{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <div className={status.className}>{status.label}</div>
          <div><span>{price.currency}</span><span>{price.amount}</span></div>
          <div className="flex gap-2">
            {actions?.map((action, index) => (
              <Button key={`action-${index}`}>
           
                <Image
                  src={action?.icon}
                  alt="actions"
                  width={1024}
                  height={1024}
                  className="w-4 h-4"
                />
                <span>{action?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      </div>
      </Link>
  );
}
