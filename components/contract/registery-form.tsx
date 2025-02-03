import { useFormik } from "formik";
import FormMaker, { OptionType } from "../shared/form-maker";
import { Button } from "../ui/button";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
export interface RegisteryFormInterface {
  accountant: string;
  accountantOptions: OptionType[];
  submitForm: (values: any) => void;
}

export default function RegisteryForm({
  submitForm,

  accountant,
  accountantOptions,
}: RegisteryFormInterface) {
  const userData = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      admitter: userData.fullName,
      accountant: accountant,
      description: "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      submitForm({
        userResponsibleId: Number(formik.values.accountant),
        description: formik.values.description,
        userSubmitterId: userData.id,
      });
    },
  });

  return (
    <div className="w-full flex flex-col items-end gap-4">
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
            component: "Select",
            placeholder: "مسئول قرارداد",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2 lg:w-1/4",
            options: accountantOptions,
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
      <Button
        variant={"info"}
        className="w-24 mx-2"
        onClick={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        ثبت
      </Button>
    </div>
  );
}
