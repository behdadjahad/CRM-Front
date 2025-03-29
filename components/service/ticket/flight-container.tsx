import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import FlightForm from "./flight-form";

export default function FlightContainer() {
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
      {addedFlights.map((item) => (
        <FlightForm
          key={item.id}
          itemId={item.id}
          onRemoveHandler={removeHandler}
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
