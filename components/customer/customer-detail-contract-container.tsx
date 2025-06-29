import { cn } from "@/lib/utils";

import InfoCard from "./customer-card";
import { setCheckedItems } from "@/store/customer-detail-contract-slice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";

export default function CustomerDetailContractContainer({
  className,
  list,
  labels,
}: {
  className?: string;
  list: any[];
  labels: any;
}) {
  const dispatch = useDispatch<any>();
  const checkedItems = useSelector(
    (state: any) => state.customerDetailContract.checkedItems
  );

  const isAllChecked = list?.every((item: any) =>
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
        (item: any) => !list?.some((l: any) => l.id === item.id)
      );

      dispatch(setCheckedItems([...updatedCheckItems, ...list]));
    } else {
      const updatedItems = checkedItems?.filter(
        (item: any) => !list?.some((l: any) => l.id === item.id)
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
          {list?.every((item: any) =>
            checkedItems.some((obj: any) => obj.id === item.id)
          )
            ? "حذف همه"
            : "انتخاب همه"}
        </Button>
      </div>
      {list.map((item, index) => (
        <InfoCard
          className="custom-shadow"
          data={item}
          key={index}
          labels={labels}
          checked={checkedItems?.some((ci: any) => ci.id === item.id)}
          onCheckChange={checkItemHandler}
        />
      ))}
    </div>
  );
}
