import { deleteStopData, editStopData, sendStopData } from "@/api/stop";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

export default function StopForm({
  onRemoveHandler,
  flightId,
  airports,
  flight,
  stop,
}: {
  onRemoveHandler: any;
  flightId: number;
  airports: any;
  flight: any;
  stop: any;
}) {
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      flightId: flight?.flightId,
      stopId: stop?.stopId,
      airport: stop?.airport?.toString(),
      description: stop?.description,
      stopTime: stop?.stopDateTime,
      isSubmitted: stop?.isSubmitted,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function removeForm(formId: any) {

    if (formik.values.isSubmitted) {
      deleteStopForm(formId);
      console.log('true')
    } else {
      onRemoveHandler(formId);
      console.log('false')
    }
  }
  const { mutate: submitStopForm } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return sendStopData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
    },
  });

  const { mutate: editStopForm } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editStopData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
    },
  });
  const { mutate: deleteStopForm } = useMutation({
    mutationFn: (formId: number) => {
      return deleteStopData(formId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
    },
  });

  function submitHandler() {
    const data = {
      stopDateTime: "1970-01-01T01:40:00Z",
      stopStationId: formik.values.airport,
      description: formik.values.description,
    };
    if (flight.isSubmitted) {
      if (!formik.values.isSubmitted) {
        submitStopForm({
          id: flightId,
          data: data,
        });
      } else {
        editStopForm({
          id: formik.values.stopId,
          data: data,
        });
      }
    } else return;
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
            key: "airport",
            component: "Select",
            placeholder: "مبدا توقف(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: airports,
          },
          {
            key: "stopTime",
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
                    removeForm(formik.values.stopId);
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
