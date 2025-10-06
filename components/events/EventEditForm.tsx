import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { dateType } from "@/lib/utils";
import { convertDateTime, convertDateTimeToGregorian } from "@/lib/date";
export interface EventEditFormInterface {
  onClose: () => void;
  onSubmitForm: (id: number, data: any) => void;
  id: number;
  title: string;
  start: string;
}
export default function EventEditForm({
  onClose,
  onSubmitForm,
  id,
  title,
  start,
}: EventEditFormInterface) {
  console.log(start);
  const formik = useFormik({
    initialValues: {
      subject: title,
      dateTime: convertDateTime(start, dateType),
      dateTimeType: dateType,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function submitForm() {
    const data = {
      subject: formik.values.subject,
      eventAt: convertDateTimeToGregorian(
        formik.values.dateTime,
        formik.values.dateTimeType
      ),
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

            type: "text",
            className: "w-full",
            labelClassName: "border placeholder:text-sm",
          },
          {
            key: "dateTime",
            component: "date-time",
            dependantKey: "dateTimeType",

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
