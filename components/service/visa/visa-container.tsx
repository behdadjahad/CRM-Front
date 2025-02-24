import { deleteVisaData, getCountries, getSubmittedVisas } from "@/api/visa";
import RegisteryForm from "@/components/contract/registery-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import VisaForm from "./visa-form";
import { insertSubmitterData } from "@/api/client";
import { getContractById } from "@/api/contract";
import { getUsers } from "@/api/auth";
import { OptionType } from "@/components/shared/form-maker";
import { getCurrencies } from "@/api/currency";

export default function VisaContainer() {
  const { id } = useParams();
  const [addedVisas, setAddedVisas] = useState<any[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [customers, setCustomers] = useState<OptionType[]>([]);
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
  const { data: countryData } = useQuery({
    queryKey: ["countryData"],
    queryFn: () => getCountries(),
  });
  useEffect(() => {
    if (countryData) {
      const countryOptions = countryData.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCountries(countryOptions);
    }
  }, [countryData]);
  const { data: submittedVisas, isLoading: isVisaLoading } = useQuery({
    queryKey: ["submittedVisa"],
    queryFn: () => getSubmittedVisas(Number(id) as number),
  });

  const { mutate: SubmitterHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertSubmitterData(data, Number(id));
    },
    onSuccess: () => {},
  });

  useEffect(() => {
    if (isVisaLoading) return;
    if (submittedVisas)
      if (submittedVisas?.data?.length) {
        setAddedVisas(
          submittedVisas.data.map((item: any) => ({
            id: item.id,
            isSubmitted: true,
            files: item.files,
            description: item.description,
            customerSoldToId: item.customerSoldToId,
          }))
        );
        console.log(23, submittedVisas);
      } else {
        setAddedVisas([
          {
            id: "visa-1",
            isSubmitted: false,
            files: null,
            description: null,
            customerSoldToId: null,
          },
        ]);
      }
  }, [submittedVisas, isVisaLoading]);
  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
  });
  useEffect(() => {
    if (contract) {
      console.log(81, contract);
      setCustomers([
        {
          label: `${contract?.mainCustomerSoldto.person.firstName ?? ""} ${
            contract?.mainCustomerSoldto.person.lastName ?? ""
          }`.trim(),

          value: contract?.mainCustomerSoldto.person.id.toString(),
        },
      ]);
    }
  }, [contract]);
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  useEffect(() => {
    if (users) {
      const userOption: OptionType[] = users.map((item) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);

  function addVisaForm() {
    setAddedVisas([
      ...addedVisas,
      {
        id: `visa-${addedVisas.length + 1}`,
        isSubmitted: false,
        files: null,
        description: null,
        customerSoldToId: null,
      },
    ]);
  }
  const { mutate: removeVisa } = useMutation({
    mutationFn: (id: number) => {
      return deleteVisaData(id);
    },
    onSuccess: () => {},
  });
  function removeHandler(formId: string | number) {
    const selectedVisa = addedVisas.find((item) => item.id == formId);
    if (selectedVisa.isSubmitted) {
      removeVisa(selectedVisa.id);
      const updatedAddedVisas = addedVisas.filter((item) => item.id != formId);
      setAddedVisas(updatedAddedVisas);
    } else if (addedVisas.length > 1) {
      const updatedAddedVisas = addedVisas.filter((item) => item.id != formId);
      setAddedVisas(updatedAddedVisas);
    } else return;
  }
  return (
    <div className="bg-transparent p-6 rounded-xl flex flex-col gap-4">
      <Button
        variant={"transparent"}
        onClick={addVisaForm}
        className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        <FaPlus />
        اضافه کردن ویزا
      </Button>
      <div className="flex flex-col-reverse">
        {addedVisas.map((item, index) => (
          <VisaForm
            key={item.id}
            visa={addedVisas[index]}
            itemId={item.id}
            onRemoveHandler={removeHandler}
            currencies={currencies}
            countries={countries}
            customers={customers}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h2>اطلاعات ثبت کننده</h2>
        <RegisteryForm
          submitForm={SubmitterHandler}
          accountant={
            contract?.userResponsible?.id
              ? contract?.userResponsible?.id.toString()
              : ""
          }
          accountantOptions={userOptions}
          className="flex-row"
        />
      </div>
    </div>
  );
}
