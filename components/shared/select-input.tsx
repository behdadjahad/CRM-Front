import React, { useCallback } from "react";
import Creatable from "react-select/creatable";
import { FormMakerInterface } from "./form-maker";

const SelectInput = React.memo(function SelectInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const handleValueChange = useCallback(
    (data: any) => {
      if (data === null) {
        form.setFieldValue(item.key, null);
      } else {
        form.setFieldValue(item.key, Number(data.value));
      }
    },
    [item.key, form]
  );

  return (
    <Creatable
      isClearable
      isValidNewOption={() => false}
      options={item.options}
      onChange={(item: any) => handleValueChange(item)}
      placeholder={
        item.options?.find((optItem) => optItem.value === form.values[item.key])
          ?.label ||
        item.placeholder ||
        item.label
      }
      classNames={{
        container: () => "relative w-full",
        control: () =>
          "outline-none h-11 w-full bg-background text-subtitle/80 placeholder:text-subtitle/80 text-right bg-primary-foreground border-none overflow-hidden focus:outline-none",
        input: () =>
          "w-full h-full outline-none text-right placeholder:text-subtitle/80 focus:outline-none",
        menuList: () =>
          "flex flex-col relative w-full cursor-default select-none items-center rounded-sm py-1.5 px-0 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", // Menu list stays the same (you can adjust further if needed)
        valueContainer: () =>
          "flex placeholder:text-subtitle/80 text-subtitle/80 focus:outline-none",
      }}
    />
  );
});

export default SelectInput;
