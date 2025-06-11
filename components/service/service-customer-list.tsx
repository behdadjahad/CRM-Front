import { Button } from "../ui/button";
import Image from "next/image";

export default function ServiceCustomerList({
  customers,
  onDeleteHandler,
  entityId,
  avService,
}: {
  customers: any[];
  onDeleteHandler: any;
  entityId: number;
  avService: string;
}) {
  return (
    <div className="flex flex-col gap-2 border border-gray-400 rounded-md p-3">
      <h2> لیست مشتری </h2>
      {customers?.map((customer: any) => (
        <div
          className="flex justify-between items-center w-full gap-4"
          key={`customer-visa-${customer.id}`}
        >
          <div
            key={customer.id}
            className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between w-full bg-[#FAFAFA]"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {" "}
                <div className="rounded-full flex items-center justify-center bg-[#F5F5F5] border border-gray-200 w-10 h-10">
                  <Image
                    src={"/icons/customer.png"}
                    alt="edit"
                    width={18}
                    height={18}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-primary-bold">
                    <>{customer.firstName + " " + customer.lastName}</>
                  </span>

                  <span className="text-sm text-foreground-mute">
                    {customer?.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-foreground-mute gap-2">
              <Image
                src={"/icons/customerMobile.png"}
                alt="edit"
                width={12}
                height={12}
              />
              <span>{customer?.phone}</span>
            </div>
            <div className="flex items-center text-foreground-mute gap-2">
              <Image
                src={"/icons/customerID.png"}
                alt="edit"
                width={18}
                height={18}
              />
              <span>{customer.idNumber}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              const data = {
                avService: avService,
                customerIds: [customer.customerId],
                entityId: entityId,
              };
              onDeleteHandler(data);
            }}
            className="text-danger border-danger"
          >
            حذف
          </Button>
        </div>
      ))}
    </div>
  );
}
