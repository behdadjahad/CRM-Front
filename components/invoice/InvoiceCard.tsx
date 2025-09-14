export interface InvoiceCardInterface {
    title: string;
    description: string;
    paymentDates:{ label: string; value: string }[];

}

export default function InvoiceCard({ title ,description}: InvoiceCardInterface) {
  return (
    <div className="custom-shadow p-4 w-full bg-card rounded-lg">
      <div className="flex justify-between flex-row-reverse">
        <div className="flex flex-col gap-2">
          <div>{title}</div>
                  <div>{description}</div>
                  <div>{
                      
                  }</div>
        </div>
        <div>پرداخت شده</div>
      </div>
    </div>
  );
}
