import { cn } from "@/lib/utils";
import CustomerCard from "./customer-card";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedItems } from "@/store/customer-slice";
import { Button } from "../ui/button";
import InfoCard from "./customer-card";

export default function CustomerContainer({
  className,
  customers,
  labels,
}: {
  className?: string;
  customers: any[];
  labels: any;
}) {
  const dispatch = useDispatch<any>();
  const checkedItems = useSelector((state: any) => state.customer.checkedItems);
  const flattedCustomers = customers?.map((item) => ({
    id: item.id,
    ...item.info,
  }));
  const isAllChecked = flattedCustomers?.every((item: any) =>
    checkedItems.some((obj: any) => obj.id === item.id)
  );

  const checkItemHandler = (listItem: any, checked: boolean) => {
    let updatedItems;

    if (checked) {
      updatedItems = [...checkedItems, listItem];
    } else {
      updatedItems = checkedItems?.filter((obj: any) => obj.id !== listItem.id);
    }

    dispatch(setCheckedItems(updatedItems));
  };
  function checkAllItemHandler() {
    if (!isAllChecked) {
      const updatedCheckItems = checkedItems?.filter(
        (item: any) => !flattedCustomers?.some((l: any) => l.id === item.id)
      );

      dispatch(setCheckedItems([...updatedCheckItems, ...flattedCustomers]));
    } else {
      const updatedItems = checkedItems?.filter(
        (item: any) => !flattedCustomers?.some((l: any) => l.id === item.id)
      );
      dispatch(setCheckedItems(updatedItems));
    }
  }

  return (
    <div className={cn("flex flex-col gap-4 bg-transparent", className)}>
      <div className="p-3 flex items-start w-full">
        {" "}
        <Button
          variant={"foreground"}
          className=""
          onClick={() => {
            checkAllItemHandler();
          }}
        >
          {flattedCustomers?.every((item: any) =>
            checkedItems.some((obj: any) => obj.id === item.id)
          )
            ? "حذف همه"
            : "انتخاب همه"}
        </Button>
      </div>
      {flattedCustomers?.map((item, index) => (
        <Link
          href={`/customer/${item.id}`}
          style={{ display: "contents" }}
          key={index}
        >
          <InfoCard
            className="custom-shadow"
            data={item}
            key={index}
            labels={labels}
            onCheckChange={checkItemHandler}
            checked={checkedItems?.some((ci: any) => ci.id === item.id)}
          />
        </Link>
      ))}
    </div>
  );
}
