import React, { useCallback, useEffect, useState } from "react";
import Creatable from "react-select/creatable";
import { components } from "react-select";
import { cn } from "@/lib/utils";
import { FormMakerInterface } from "./form-maker";

const MultiSelectInput = React.memo(function MultiSelectInput({
  form,
  item,
  disabled = false
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  disabled?: boolean
}) {
  const [options, setOptions] = useState(item.options || []);

  const handleValueChange = useCallback(
    (data: any) => {

      const values = data?.length > 0 ? data.map((d: any) => d.value) : [];

      form.setFieldValue(item.key, [...(form?.values[item.key] || []), ...values]);
      if (item.dependantKey) {
        form.setFieldValue(item.dependantKey, [
          ...(form.values[item.dependantKey] || []), // <-- safe fallback
          ...(data || []),
        ]);
      }
    },
    [item.key, form]
  );

  const selectedValues = options?.filter((opt) =>
    form.values[item.key]?.includes(opt.value)
  );

  const handleCreateOption = (inputValue: string) => {
    const exists = options.some((opt) => opt.value === inputValue);
    if (!exists) {
      const newOption = { value: inputValue, label: inputValue };
      setOptions((prev) => [...prev, newOption]);
      form.setFieldValue(item.key, [
        ...(form.values[item.key] || []),
        inputValue,
      ]);
      if (item.dependantKey) {
        form.setFieldValue(item.dependantKey, [
          ...(form.values[item.dependantKey] || []),
          newOption,
        ]);
      }
      if (item?.sendValue) item?.sendValue(inputValue);
    }
  };
  const filteredOptions = options.filter(
    (opt) => !form.values[item.key]?.includes(opt.value)
  );

  return (
    <Creatable

      isClearable
      isMulti
      menuPlacement={item.menuPlacement}
      isValidNewOption={(inputValue, selectValue, selectOptions) => {
        if (!inputValue) return false;
        const exists = selectOptions.some(
          (opt) => opt.value.toLowerCase() === inputValue.toLowerCase()
        );
        return !exists;
      }}
      options={filteredOptions}
      formatCreateLabel={(inputValue) => (
        <div className="flex justify-between w-full">
          <span>{inputValue}</span>
          <span>+ افزودن</span>
        </div>
      )}
      onCreateOption={handleCreateOption}
      onChange={(data: any) => {
        handleValueChange(data);
        if (item.onChange) item.onChange(data);
      }}
      isDisabled={disabled}
      placeholder={item.placeholder || item.label || "انتخاب کنید"}
      value={[]} // Keep it empty to avoid tags inside
      components={{
        Placeholder: (props) => (
          <components.Placeholder {...props}>
            {item.placeholder || item.label || "انتخاب کنید"}
          </components.Placeholder>
        ),
      }}
      classNames={{
        container: () => cn("w-full rounded-lg", item.containerClassName),
        control: () =>
          cn(
            "outline-none !rounded-lg w-full bg-background text-subtitle/80 placeholder:text-subtitle/80 text-right bg-primary-foreground border-none focus:outline-none !min-h-11 !border !border-1 !border-gray-200",
            item.controlClassName
          ),
        input: () =>
          cn(
            "w-full h-full outline-none text-right placeholder:text-foreground-mute focus:outline-none rounded-lg",
            item.inputClassName
          ),
        menuList: () =>
          cn(
            "flex flex-col relative w-full cursor-default select-none items-center rounded-sm py-1.5 px-0 text-sm outline-none max-h-96 overflow-hidden z-50 rounded-md bg-popover text-popover-foreground",
            item.menuClassName
          ),
        valueContainer: () =>
          cn(
            "flex placeholder:text-subtitle/80 text-subtitle/80 focus:outline-none",
            item.valueContainerClassName
          ),
      }}
    />
  );
});

export default MultiSelectInput;
