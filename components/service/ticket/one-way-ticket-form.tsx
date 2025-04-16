import { useFormik } from "formik";
import FormMaker from "../../shared/form-maker";
import { Button } from "../../ui/button";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";
import StopForm from "./stop-form";

export default function OneWayTicketForm({
  itemId,
  onRemoveHandler,
  flightClassOptions,
  flightTypeOptions,
}: {
  itemId: any;
  onRemoveHandler: any;
  flightClassOptions: any;
  flightTypeOptions: any;
}) {
  const formik = useFormik({
    initialValues: {
      originCityAirport: "",
      originTerminal: "",
      dateTime: "",
      destinationCityAirport: "",
      destinationTerminal: "",
      airline: "",
      cost: "",
      currency: "",
      broker:"",
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
  function removeTicketForm(formId: any) {
    onRemoveHandler(formId);
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
            key: "originCityAirport",
            component: "Select",
            placeholder: "مبدا(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "originTerminal",
            component: "Select",
            placeholder: "ترمینال مبدا",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "dateTime",
            component: "date",
            placeholder: "تاریخ و ساعت",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "destinationCityAirport",
            component: "Select",
            placeholder: "مقصد(شهر،فرودگاه)",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "destinationTerminal",
            component: "Select",
            placeholder: "ترمینال مقصد",
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
            key: "flightClass",
            component: "list-preview",
            title: "کلاس پرواز",
            options: flightClassOptions,
          },
          {
            key: "flightType",
            component: "list-preview",
            title: "نوع پرواز",
            options: flightTypeOptions,
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
                <Button
                  variant="info"
                  onClick={() => {
                 
                  }}
                >
                  ثبت بلیط
                </Button>
                <Button
                  onClick={() => {
                    removeTicketForm(itemId);
                  }}
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
