import React, { useCallback } from "react";
import Creatable from "react-select/creatable";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import { components, SingleValueProps, OptionProps } from "react-select";
const SelectInput = React.memo(function SelectInput({
  form,
  item,
   disabled=false
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  disabled?:boolean
}) {
  const handleValueChange = useCallback(
    (data: any) => {
      if (data === null) {
        form.setFieldValue(item.key, null);
      } else {
        form.setFieldValue(item.key, data.value);
      }
    },
    [item.key, form]
  );
  // Custom Option (dropdown list)
  const CustomOption = (props: OptionProps<any>) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.label}</span>
      </div>
    </components.Option>
  );

  // Custom SingleValue (selected display)
  const CustomSingleValue = (props: SingleValueProps<any>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
  return (
    <Creatable
      isClearable
      menuPlacement={item?.menuPlacement}
      isValidNewOption={() => false}
      options={item.options}
      onChange={(data: any) => {
        handleValueChange(data);
        if (item.onChange) {
          item.onChange(data);
        }
      }}
      placeholder={
        item.options?.find((optItem) => optItem.value == form.values[item.key])
          ?.label ||
        item.placeholder ||
        item.label
      }
      value={
        item.options?.find(
          (optItem) => optItem.value === form.values[item.key]
        ) || null
      }
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      classNames={{
        container: () => {
          return cn("w-full rounded-lg", item.containerClassName);
        },
        control: () => {
          return cn(
            "outline-none  !rounded-lg w-full bg-background text-subtitle/80 placeholder:text-subtitle/80 text-right bg-primary-foreground border-none overflow-hidden focus:outline-none h-11 !border !border-1 !border-gray-200",
            item.controlClassName
          );
        },
        // placeholder: () =>
        //   "w-full h-full outline-none text-right placeholder:text-foreground-mute focus:outline-none !text-xs !text-foreground-mute",
        input: () => {
          return cn(
            "w-full h-full outline-none text-right placeholder:text-foreground-mute focus:outline-none rounded-lg",
            item.inputClassName
          );
        },

        menuList: () => {
          return cn(
            "flex flex-col relative w-full cursor-default select-none items-center rounded-sm py-1.5 px-0 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 relative z-50 max-h-96  overflow-hidden rounded-md bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            item.menuClassName
          );
        }, // Menu list stays the same (you can adjust further if needed)
        valueContainer: () => {
          return cn(
            "flex placeholder:text-subtitle/80 text-subtitle/80 focus:outline-none",
            item.valueContainerClassName
          );
        },
        dropdownIndicator: () => {
          return cn("", item.dropdownIndicatorClassName);
        },
        clearIndicator: () => {
          return cn("", item.clearIndicatorClassName);
        },
      }}
    />
  );
});

export default SelectInput;
