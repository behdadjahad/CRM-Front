import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TicketForm from "./ticket-form";
import { useQuery } from "@tanstack/react-query";
import { getTransportationType } from "@/api/transportation";

export default function TicketContainer() {
  const [addedTickets, setAddedTickets] = useState<any[]>([{
    id: `ticket-1`,
  }]);
  function addTicketForm() {
    setAddedTickets([
      ...addedTickets,
      {
        id: `ticket-${addedTickets.length + 1}`,
      },
    ]);
  }
  function removeHandler(formId: any) {
    if (addedTickets.length > 1) {
      const updatedAddedFlights = addedTickets.filter(
        (item) => item.id != formId
      );
      setAddedTickets(updatedAddedFlights);
    } else return;
  }
  
    const { data: transportationData } = useQuery({
      queryKey: ["transportationData"],
      queryFn: () => getTransportationType(),
    });
    useEffect(() => {
      if (transportationData) {
        console.log(36,transportationData)
      }
    }, [transportationData]);
  return (
    <div className="bg-card p-6 rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
      <h2>سرویس مدیریت پروازها</h2>
      <Button
        variant={"transparent"}
        onClick={addTicketForm}
        className={cn("text-aqua-foreground")}
      >
        <FaPlus />
        افزودن بلیط
      </Button>
      </div>
      <div className="flex flex-col-reverse">
        {addedTickets.map((item) => (
          <TicketForm key={item.id} itemId={item.id} onRemoveHandler={removeHandler}/>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h2>اطلاعات ثبت کننده</h2>
        {/* <RegisteryForm
        submitForm={SubmitterHandler}
        accountant={
          contract?.userResponsible?.id
            ? contract?.userResponsible?.id.toString()
            : ""
        }
        accountantOptions={userOptions}
        className="flex-row"
      /> */}
      </div>
    </div>
  );
}
