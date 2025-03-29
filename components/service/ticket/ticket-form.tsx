import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import FlightContainer from "./flight-container";
import OneWayTicketForm from "./one-way-ticket-form";
import RoundTripTicketForm from "./round-trip-ticket-form";

export default function TicketForm({
  itemId,
  onRemoveHandler,
}: {
  itemId: any;
  onRemoveHandler: any;
}) {
  const [category, setCategory] = useState("one-way");

  return (
    <div className={cn("flex flex-col gap-4 bg-card rounded-md p-3")}>
      <RadioGroup
        defaultValue="one-way"
        className="flex flex-row-reverse gap-4 min-h-10"
      >
        <div className="flex items-center space-x-2">
          <label htmlFor="one-way">یک طرفه</label>
          <RadioGroupItem
            value="one-way"
            id="one-way"
            onClick={() => {
              setCategory("one-way");
              console.log(itemId);
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="round-trip">رفت و برگشت</label>
          <RadioGroupItem
            value="round-trip"
            id="round-trip"
            onClick={() => {
              setCategory("round-trip");
              console.log(itemId);
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="multi-route">چندمسیره</label>
          <RadioGroupItem
            value="multi-route"
            id="multi-route"
            onClick={() => {
              setCategory("multi-route");
              console.log(itemId);
            }}
          />
        </div>
      </RadioGroup>
      {category === "one-way" ? (
        <OneWayTicketForm
          itemId={itemId}
          onRemoveHandler={onRemoveHandler}
        />
      ) : category === "round-trip" ? (
          <RoundTripTicketForm itemId={itemId} />
      ) : (
        <FlightContainer />
      )}
    </div>
  );
}
