import { FaPlus } from "react-icons/fa";
import OtherForm from "./other-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { deleteOtherData, getSubmittedOthers } from "@/api/other";
import { getCurrencies } from "@/api/currency";
import { OptionType } from "@/components/shared/form-maker";

export default function OtherContainer() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const { data: currency } = useQuery({
    queryKey: ["Currency"],
    queryFn: () => getCurrencies(),
  });
  useEffect(() => {
    if (currency) {
      const currencyOptions = currency.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCurrencies(currencyOptions);
    }
  }, [currency]);

  const [addedOthers, setAddedOthers] = useState<any[]>([
    {
      id: "other-1",
      title: "",
      description: "",
      files: [],
      isSubmitted: false,
      cost: "",
      currency: "",
    },
  ]);
  const { data: submittedOthers, isLoading: isOtherLoading } = useQuery({
    queryKey: ["submittedOthers"],
    queryFn: () => getSubmittedOthers(Number(id) as number),
  });

  useEffect(() => {
    if (isOtherLoading) return;
    if (submittedOthers?.data?.length) {
      setAddedOthers(
        submittedOthers.data.map((item: any) => ({
          id: item.id,
          isSubmitted: true,
          description: item.description,
          title: item.title,
        }))
      );
    } else {
      setAddedOthers([
        {
          id: `other-1`,
          title: "",
          isSubmitted: false,
          description: "",
          files: [],
          cost: "",
          currency: "",
        },
      ]);
    }
  }, [submittedOthers, isOtherLoading]);
  function addOtherForm() {
    setAddedOthers([
      ...addedOthers,
      {
        id: `other-${addedOthers.length + 1}`,
        title: null,
        isSubmitted: false,
      },
    ]);
  }
  const { mutate: removeOther } = useMutation({
    mutationFn: (id: number) => {
      return deleteOtherData(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submittedOthers"],
      });
    },
  });
  function removeHandler(formId: string | number) {
    const selectedOther = addedOthers.find((item) => item.id == formId);
    if (selectedOther.isSubmitted) {
      removeOther(selectedOther.id);
      const updatedAddedOthers = addedOthers.filter(
        (item) => item.id != formId
      );
      setAddedOthers(updatedAddedOthers);
    } else if (addedOthers.length > 1) {
      const updatedAddedOthers = addedOthers.filter(
        (item) => item.id != formId
      );
      setAddedOthers(updatedAddedOthers);
    } else return;
  }

  return (
    <div className="bg-card p-6 rounded-xl flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant={"transparent"}
          onClick={addOtherForm}
          className={cn("text-aqua-foreground flex justify-end w-full")}
        >
          <FaPlus />
          اضافه کردن فرم
        </Button>
      </div>
      {addedOthers.map((item) => (
        <OtherForm
          key={item.id}
          itemId={item.id}
          onRemoveHandler={removeHandler}
          other={item}
          currencies={currencies}
        />
      ))}
    </div>
  );
}
