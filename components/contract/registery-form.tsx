import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";

export default function RegisteryForm() {
  const formik = useFormik({
    initialValues: {
      admitter: "",
      accountant: "",
      description: "",
    },
    onSubmit: async () => {},
  });

  return (
    <div className="flex flex-col items-end w-full">
      <FormMaker
        form={formik}
        fields={[
          {
            key: "admitter",
            component: "input",
            placeholder: "ثبت کننده",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2 lg:w-1/4",
          },
          {
            key: "accountant",
            component: "input",
            placeholder: "مسئول قرارداد",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2 lg:w-1/4",
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
        ]}
        className="w-full flex-row-reverse"
      />
    </div>
  );
}
