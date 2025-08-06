import SelectableTagCard from "@/components/share/SelectableTagCard";
import { FormMakerInterface, OptionType } from "@/components/shared/form-maker";
import { cn } from "@/lib/utils";

export default function SelectableTagInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div
      className={cn(
        "flex  gap-4 flex-wrap w-full",
        item?.className
      )}
    >
      {item?.options?.map((tag: OptionType) => (
        <SelectableTagCard
          key={tag.value}
          {...tag}
          onActiveHandler={(value: string) => {
            form.setFieldValue(item.key, value);
          }}
          isActive={form.values[item.key] === tag.value}
        />
      ))}
    </div>
  );
}
