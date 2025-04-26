import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { REQUIRED_TEXT } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function OtherContainer({ itemId,onRemoveHandler }: { itemId: any,onRemoveHandler:any; }) {
  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      title: Yup.string().required(REQUIRED_TEXT),
    }),

    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function removeForm(formId: string) {
    onRemoveHandler(formId);
  }

  return (
    <div className="bg-card flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <h2>سایر </h2>
      <FormMaker
        form={formik}
        fields={[
          {
            key: "title",
            component: "input",
            placeholder: "عنوان",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            className: "w-full md:w-2/3",
          },
          {
            component: "non-field",
            key: "title",
            children: (
              <h2 className="w-full border-t-4 border-dashed pt-3">خرید</h2>
            ),
          },

          {
            key: "cost",
            component: "input",
            placeholder: "هزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },

          {
            key: "currency",
            component: "Select",
            placeholder: "ارزهزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "broker",
            component: "Select",
            placeholder: "کارگزار",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },

          {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button variant="info" onClick={() => {}}>
                  ثبت
                </Button>
                <Button
                  onClick={() => {
                    removeForm(itemId);
                  }}
                  className="text-danger border-danger"
                >
                  حذف
                </Button>
              </div>
            ),
          },
        ]}
        className=""
      />
    </div>
  );
}
