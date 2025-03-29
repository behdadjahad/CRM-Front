import { useFormik } from "formik";
import FormMaker from "../../shared/form-maker";
import { Button } from "../../ui/button";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";
import StopForm from "./stop-form";

export default function OneWayTicketForm({itemId,onRemoveHandler}: {itemId:any,onRemoveHandler:any }) {
  const formik = useFormik({
    initialValues: {
      country: "",
      city: "",
      hotelName: "",
      serviceType: "",
      accommodationType: "",
      voucherFile: "",
      id: "",
      isSubmitted: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const [addedStops, setAddedStops] = useState<any[]>([]);
  function addStopForm() {
    setAddedStops([
      ...addedStops,
      {
        id: `stop-${addedStops.length + 1}`,
      },
    ]);
  }

  function removeHandler(formId: any) {
    const updatedAddedFlights = addedStops.filter((item) => item.id != formId);
    setAddedStops(updatedAddedFlights);
  }
  function removeTicketForm(formId:any){
   onRemoveHandler(formId)
  }
  return (
    <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <div className="flex items-center gap-2">
        <h2 className="p-3">یک طرفه</h2>
        <Button
          variant={"transparent"}
          onClick={addStopForm}
          className={cn(
            "w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
          )}
        >
          <FaPlus className="text-white" />
        </Button>
      </div>
      <FormMaker
        form={formik}
        fields={[
          {
            key: "origin-city-airport",
            component: "input",
            placeholder: "مبدا(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "origin-terminal",
            component: "input",
            placeholder: "ترمینال مبدا",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "origin-date-time",
            component: "date",
            placeholder: "تاریخ و ساعت",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "destination-city-airport",
            component: "input",
            placeholder: "مقصد(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "destination-airport",
            component: "input",
            placeholder: "ترمینال مقصد",
            type: "text",
            floating: true,

            className: "w-full md:w-1/3",
          },
          {
            key: "origin-date-time",
            component: "date",
            placeholder: "تاریخ و ساعت",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "airline",
            component: "Select",
            placeholder: "ایرلاین",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button variant="info" onClick={() => {console.log(itemId)}}>
                  ثبت بلیط
                </Button>
                <Button
                  onClick={() => {removeTicketForm(itemId);}}
                  className="text-danger border-danger"
                >
                  حذف بلیط
                </Button>
              </div>
            ),
          },
        ]}
        className=""
      />

      {addedStops.map((item) => (
        <StopForm
          key={item.id}
          onRemoveHandler={removeHandler}
          itemId={item.id}
        />
      ))}
    </div>
  );
}
