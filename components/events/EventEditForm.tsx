import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
export interface EventEditFormInterface {
  onClose: () => void;
  onSubmitForm: (id: number, data: any) => void;
  id: number;
  title: string;
}
export default function EventEditForm({
  onClose,
  onSubmitForm,
  id,
  title,
}: EventEditFormInterface) {
  const formik = useFormik({
    initialValues: {
      subject: title,
      dateTime: "",
      dateTimeType: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function submitForm() {
    const data = {
      subject: formik.values.subject,
      eventAt: formik.values.dateTime,
    };
    onSubmitForm(id, data);
  }
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
            labelClassName: "border placeholder:text-sm",
          },
          {
            key: "dateTime",
            component: "date-time",
            dependantKey: "dateTimeType",
            placeholder: "تاریخ و زمان",
            type: "text",
            className: "w-full",
            labelClassName: "border placeholder:text-sm",
          },
        ]}
        className="flex flex-col w-full"
      />
      <div className="w-full flex items-center justify-center gap-2">
        <Button
          variant={"info"}
          className="w-full"
          onClick={() => {
            submitForm();
            onClose();
          }}
        >
          ذخیره
        </Button>
        <Button
          variant={"foreground"}
          className="w-full"
          onClick={() => {
            onClose();
          }}
        >
          لغو
        </Button>
      </div>
    </>
  );
}
