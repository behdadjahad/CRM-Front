import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";

export default function SettingEditForm() {
  const formik = useFormik({
    initialValues: {
      country: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <div className="w-full">
      <FormMaker
        form={formik}
        fields={[
          {
            key: "country",
            component: "Select",
            placeholder: "کشور",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: [],
          },
          {
            key: "city",
            component: "Select",
            placeholder: "شهر",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: [],
          },
          {
            key: "airport",
            component: "Select",
            placeholder: "فرودگاه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: [],
          },

          {
            component: "non-field",
            key: "actions",
            children: (
                <Button variant="info" onClick={() => { }}>
                    ثبت ویرایش
              </Button>
            ),
            className: "w-full md:w-1/4",
          },
        ]}
        className="w-full flex flex-row"
      />
    </div>
  );
}
