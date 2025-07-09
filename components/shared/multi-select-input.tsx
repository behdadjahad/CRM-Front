import React, { useCallback } from "react";
import Creatable from "react-select/creatable";
import { cn } from "@/lib/utils";
import { FormMakerInterface } from "./form-maker";

const MultiSelectInput = React.memo(function MultiSelectInput({
  form,
  item,
}: {
  form: any;
  item:FormMakerInterface["fields"][0];
}) {
  const handleValueChange = useCallback(
    (data: any) => {
      if (!data || data.length === 0) {
        form.setFieldValue(item.key, []);
      } else {
        const values = data.map((d: any) => d.value);
        form.setFieldValue(item.key, values);
      }
    },
    [item.key, form]
  );

  const selectedValues = item?.options?.filter((opt) =>
    form.values[item.key]?.includes(opt.value)
  );

  return (
    <Creatable
      isClearable
      isMulti
      menuPlacement={item.menuPlacement}
      isValidNewOption={() => false} // disable creation if you want
      options={item.options}
      onChange={(data: any) => {
        handleValueChange(data);
        if (item.onChange) {
          item.onChange(data);
        }
      }}
      placeholder={selectedValues&&
        selectedValues?.length > 0
          ? null
          : item.placeholder || item.label || "انتخاب کنید"
      }
      value={selectedValues&& selectedValues?.length > 0 ? selectedValues : null}
      classNames={{
        container: () => cn("w-full", item.containerClassName),
        control: () =>
          cn(
            "outline-none w-full bg-background text-subtitle/80 placeholder:text-subtitle/80 text-right bg-primary-foreground border-none overflow-hidden focus:outline-none",
            item.controlClassName
          ),
        input: () =>
          cn(
            "w-full h-full outline-none text-right placeholder:text-foreground-mute focus:outline-none",
            item.inputClassName
          ),
        menuList: () =>
          cn(
            "flex flex-col relative w-full cursor-default select-none items-center rounded-sm py-1.5 px-0 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 relative z-50 max-h-96 overflow-hidden rounded-md bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            item.menuClassName
          ),
        valueContainer: () =>
          cn(
            "flex placeholder:text-subtitle/80 text-subtitle/80 focus:outline-none",
            item.valueContainerClassName
          ),
        dropdownIndicator: () => cn("", item.dropdownIndicatorClassName),
        clearIndicator: () => cn("", item.clearIndicatorClassName),
      }}
    />
  );
});

export default MultiSelectInput;
