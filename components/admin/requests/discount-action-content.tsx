import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFormik } from "formik";

export interface DiscountActionContentInterface {
  price: string;
  onSubmit: (discount: number) => void;
}

export default function DiscountActionContent({
  price,
  onSubmit,
}: DiscountActionContentInterface) {
  const formik = useFormik({
    initialValues: { discount: 0 },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <>
      <FormMaker
        form={formik}
        fields={[
          {
            key: "price",
            component: "input",
            placeholder: "قیمت فعلی",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
            defaultValue: formatPrice(Number(price))
          },

          {
            key: "discount",
            component: "input",
            placeholder: "درصد تخفیف",
            type: "number",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
        ]}
        className="flex flex-row w-full"
      />
       
      <div className="flex items-center gap-2">
        {" "}
        <Button
          variant={"info"}
          onClick={() => {
            onSubmit(formik.values.discount);
          }}
        >
          تایید
        </Button>
        <Button variant={"foreground"} onClick={() => {}}>
          لغو
        </Button>
      </div>
    </>
  );
}
