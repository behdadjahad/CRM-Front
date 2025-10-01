import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";

export default function EventEditForm() {
  const formik = useFormik({
    initialValues: {
      subject: "",
      dateTime: "",
      dateTimeType: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <>
      {" "}
      <FormMaker
        form={formik}
        fields={[
          {
            key: "subject",
            component: "input",
            placeholder: "موضوع",
            type: "text",
            className: "w-full",
            labelClassName: "border",
          },
          {
            key: "dateTime",
            component: "date-time",
            dependantKey: "dateTimeType",
            placeholder: "تاریخ و زمان",
            type: "text",
            className: "w-full",
            labelClassName: "border",
          },
        ]}
        className="flex flex-col w-full"
      />
      <div className="w-full flex items-center justify-center gap-2">
        <Button variant={"info"} className="w-full">
          ذخیره
        </Button>
        <Button variant={"foreground"} className="w-full">
          لغو
        </Button>
      </div>
    </>
  );
}
