import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import FlightForm from "./flight-form";
import { OptionType } from "@/components/shared/form-maker";

export default function FlightContainer({
  flightClassOptions,
  flightTypeOptions,
  airlines,
  airports
}: {
  flightClassOptions: any;
  flightTypeOptions: any;
    airlines: OptionType[];
    airports:OptionType[];
}) {
  const [addedFlights, setAddedFlights] = useState<any[]>([
    {
      id: `flight-1`,
    },
  ]);
  function addFlightForm() {
    setAddedFlights([
      ...addedFlights,
      {
        id: `flight-${addedFlights.length + 1}`,
      },
    ]);
  }
  function removeHandler(formId: any) {
    if (addedFlights.length > 1) {
      const updatedAddedFlights = addedFlights.filter(
        (item) => item.id != formId
      );
      setAddedFlights(updatedAddedFlights);
    } else return;
  }
  return (
    <div className="bg-card rounded-xl flex flex-col gap-4">
      {addedFlights.map((item, index) => (
        <FlightForm
          key={item.id}
          itemId={item.id}
          onRemoveHandler={removeHandler}
          flightClassOptions={flightClassOptions}
          flightTypeOptions={flightTypeOptions}
          count={(index + 1).toString()}
          airlines={airlines}
          airports={airports}
        />
      ))}
      <Button
        variant={"transparent"}
        className={cn("text-aqua-foreground flex justify-end w-full")}
        onClick={addFlightForm}
      >
        <FaPlus />
        اضافه کردن پرواز
      </Button>
    </div>
  );
}
