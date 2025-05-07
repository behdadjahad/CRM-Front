import { sendStopData } from "@/api/stop";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

export default function StopForm({
  itemId,
  onRemoveHandler,
  flightId
}: {
  itemId: any;
    onRemoveHandler: any;
    flightId:number
}) {
  const formik = useFormik({
    initialValues: {
      flightId:"",
      id: "",
      isSubmitted: false,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function removeForm(formId: any) {
    onRemoveHandler(formId);
  }
  const { mutate: submitStopForm } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return sendStopData(data, id);
    },
    onSuccess: () => {},
  });
  function submitHandler() {
    const data = {
      stopDateTime: "2000-01-01T00:00:00Z",
      stopStationId: 1,
      description: "string"
    };
    submitStopForm({
      id: flightId,
      data: data,
    });
  }
  return (
    <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <div className="flex items-center gap-2">
        <h2 className="p-3">توقف</h2>
      </div>
      <FormMaker
        form={formik}
        fields={[
          {
            key: "stop-origin",
            component: "input",
            placeholder: "مبدا توقف(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "stop-time",
            component: "input",
            placeholder: "مدت زمان توقف",
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
            className: "w-full",
          },
            {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button variant="info" onClick={submitHandler}>
                  ثبت توقف
                </Button>
                <Button
                  onClick={() => {
                    removeForm(itemId);
                  }}
                  className="text-danger border-danger"
                >
                  حذف توقف
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
