import React, { useCallback, useState } from "react";
import Creatable from "react-select/creatable";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import { components, SingleValueProps, OptionProps } from "react-select";

const SuggestionInput = React.memo(function SelectInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const [inputValue, setInputValue] = useState("");

  const handleValueChange = useCallback(
    (data: any) => {
      if (data === null) {
        form.setFieldValue(item.key, null);
      } else {
        form.setFieldValue(item.key, data.label);
      }
    },
    [item.key, form]
  );

  const CustomOption = (props: OptionProps<any>) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.label}</span>
      </div>
    </components.Option>
  );

  const CustomSingleValue = (props: SingleValueProps<any>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  const selectedOption =
    item.options?.find(
      (optItem) => optItem.label === form.values[item.key]
    ) ??
    (form.values[item.key]
      ? { label: form.values[item.key], value: form.values[item.key] }
      : null);

  return (
    <Creatable
      isClearable
      inputValue={inputValue}
      onInputChange={(newValue) => {
        setInputValue(newValue);
      }}
      onBlur={() => {
        // When the user leaves the input field, commit the input value
        if (
          inputValue &&
          !item.options?.some((opt) => opt.label === inputValue)
        ) {
          form.setFieldValue(item.key, inputValue);
        }
      }}
      onChange={(data: any) => {
        handleValueChange(data);
        setInputValue(""); // Clear input field
        if (item.onChange) {
          item.onChange(data);
        }
      }}
      options={item.options}
      placeholder={
        item.options?.find((optItem) => optItem.value == form.values[item.key])
          ?.label ||
        item.placeholder ||
        item.label
      }
      value={selectedOption}
      formatCreateLabel={() => null} // disables "Create ..."
      getNewOptionData={(inputValue) => ({
        label: inputValue,
        value: inputValue,
      })}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      classNames={{
        container: () => cn("w-full", item.containerClassName),
        control: () =>
          cn(
            "outline-none  w-full bg-background text-subtitle/80 placeholder:text-subtitle/80 text-right bg-primary-foreground border-none overflow-hidden focus:outline-none",
            item.controlClassName
          ),
        input: () =>
          cn(
            "w-full h-full outline-none text-right placeholder:text-foreground-mute focus:outline-none",
            item.inputClassName
          ),
        menuList: () =>
          cn(
            "flex flex-col relative w-full cursor-default select-none items-center rounded-sm py-1.5 px-0 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 relative z-50 max-h-96  overflow-hidden rounded-md bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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

export default SuggestionInput;
