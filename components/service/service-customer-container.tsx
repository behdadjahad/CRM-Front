import ServiceCustomerCard from "./service-customer-card";

export default function ServiceCustomerContainer({
  list,
  onCheckCustomerHandler,
}: {
  list: any;
  onCheckCustomerHandler: any;
}) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {list?.map((item: any) => (
        <ServiceCustomerCard
          key={item.id}
          customer={item}
          onCheckCustomerHandler={onCheckCustomerHandler}
     
        />
      ))}
    </div>
  );
}
