import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { hotelExtender } from "@/constants/extendable-fields";
import { useState } from "react";
import FormExtender from "../shared/form-extender";
import RegisteryForm from "../contract/registery-form";
import FormMaker from "../shared/form-maker";
import { purchaseInfo } from "@/constants/service-form-fields";
import { useFormik } from "formik";

export default function HotelForm() {
  let formValues = {};
  const [fetchFormValues, setFetchFormValues] = useState(false);

  function submitForm(key: string, data: any) {
    formValues = {
      ...formValues,
      [key]: data,
    };

    setFetchFormValues(false);
  }
  const purchaseFormik = useFormik({
    initialValues: {
      costPerNight: "",
      currency: "",
      broker: "",
    },
    onSubmit: async () => {},
  });
  return (
    <div className="w-full bg-card rounded-lg">
      <div className="w-full p-4">
        <div className="flex flex-row text-xs md:text-sm md:p-4 md:gap-4 font-foreground">
          <RadioGroup
            defaultValue="hotel"
            className="flex flex-row-reverse gap-4 min-h-10"
          >
            <div className="flex items-center space-x-2">
              <label htmlFor="hotel">هتل</label>
              <RadioGroupItem value="hotel" id="hotel" />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="apartment">آپارتمان</label>
              <RadioGroupItem value="apartment" id="apartment" />
            </div>
          </RadioGroup>
        </div>

        {hotelExtender.map((item) => (
          <FormExtender
            key={item.title}
            title={item.title ?? ""}
            fields={item.fields ?? []}
            initialValues={item.initialValues}
            validationSchema={item.validationSchema}
            callbackSubmit={submitForm}
            fetchFormValues={fetchFormValues}
            wrapperClassName="flex-row flex-wrap"
          />
        ))}
        <div className="flex flex-col gap-4 px-4">
          <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">خرید</div>
            <FormMaker form={purchaseFormik} fields={purchaseInfo} />
          </div>
          <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">
              اطلاعات مشتری (ثبت کننده)
            </div>

            <RegisteryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
