import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";

export default function UnitCostForm({ subFields,subInitialValues }: { subFields: any[],subInitialValues:any[] }) {
  const formik = useFormik({
    initialValues: subInitialValues,
  
    onSubmit: async () => {},
  });
  return (
    <div className="border rounded-md p-3">
      <FormMaker
        form={formik}
        fields={[
          ...subFields,
          {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex gap-2">
                <Button variant="info" onClick={() => {}}>
                  ثبت
                </Button>
                <Button variant="foreground" onClick={() => {}}>
                  حذف
                </Button>
              </div>
            ),
            className: "w-full flex items-end",
          },
        ]}
        className="w-full flex flex-col"
      />
    </div>
  );
}
