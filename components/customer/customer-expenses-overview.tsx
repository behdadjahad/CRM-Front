import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { formatPrice } from "@/lib/utils";

interface CustomerExpensesInterface {
  list: {
    label: string;
    value: string;
  }[];
}
export default function CustomerExpensesOverview({
  list,
}: CustomerExpensesInterface) {
  const expenseFormik = useFormik({
    initialValues: {
      currency: "",
    },
    onSubmit: async () => {},
  });
  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-between items-center gap-4">
        {list.map((item) => (
          <div key={item.label} className="flex gap-2 items-center">
            <div className="text-card">{item.label}:</div>
            <div className="bg-card px-2 py-1 rounded-sm">
              {formatPrice(item.value)}
            </div>
          </div>
        ))}
      </div>
      <FormMaker
        form={expenseFormik}
        fields={[
          {
            key: "currency",
            component: "Select",
            type: "text",
            placeholder: "واحد ارزی",
          },
        ]}
        className="w-1/4"
      />
    </div>
  );
}
