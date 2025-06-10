import {
  deleteVisaData,
  getCountries,
  getSubmittedVisas,
  getVisaDurationTypes,
  getVisaEntranceTypes,
  getVisaTypes,
} from "@/api/visa";
import RegisteryForm from "@/components/contract/registery-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [addedVisas, setAddedVisas] = useState<any[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);

  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);

  const [visaTypes, setVisaTypes] = useState<OptionType[]>([]);
  const [visaDurationTypes, setVisaDurationTypes] = useState<OptionType[]>([]);
  const [visaEntranceTypes, setVisaEntranceTypes] = useState<OptionType[]>([]);
  const [visaCustomers, setVisaCustomers] = useState<any[]>([]);
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
            // customerSoldToId: item.customerSoldToId,
            country: item.countryId,
            visaType: item.visaTypeId,
            visaApproval: item.visaEntranceTypeId,
            visaTime: item.visaDurationTypeId,
            visaCost: item.priceWeBuy,
            currency: item.currencyWeBuyId,
            customers: item.customers.map((customer: any) => ({
              customerId:customer?.id,
              firstName: customer?.person?.firstName,
              lastName: customer?.person?.lastName,
              idNumber:customer?.person?.idNumber
            })),
          }))
        );
      } else {
        setAddedVisas([
          {
            id: `visa-${addedVisas.length + 1}`,
            isSubmitted: false,
            files: null,
            description: null,
            // customerSoldToId: null,
            country: null,
            visaType: null,
            visaApproval: null,
            visaTime: null,
            visaCost: null,
            currency: null,
            customers: [],
          },
        ]);
      }
  }, [submittedVisas, isVisaLoading]);
  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
  });

  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  useEffect(() => {
    if (users) {
      const userOption: OptionType[] = users?.data?.map((item: any) => ({
        label: item?.fullName,
        value: item?.id?.toString(),
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
        country: null,
        visaType: null,
        visaApproval: null,
        visaTime: null,
        visaCost: null,
        currency: null,
      },
    ]);
  }
  const { mutate: removeVisa } = useMutation({
    mutationFn: (id: number) => {
      return deleteVisaData(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["submittedVisa"] });
    },
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
  const { data: visaTypesData } = useQuery({
    queryKey: ["visaTypesData"],
    queryFn: async () => await getVisaTypes(),
  });
  useEffect(() => {
    if (visaTypesData) {
      const visaTypeOptions: OptionType[] = visaTypesData.data.map(
        (item: any) => ({
          label: item.name,
          value: item.id.toString(),
        })
      );
      setVisaTypes(visaTypeOptions);
    }
  }, [visaTypesData]);
  const { data: visaDurationTypesData } = useQuery({
    queryKey: ["visaDurationTypesData"],
    queryFn: async () => await getVisaDurationTypes(),
  });
  useEffect(() => {
    if (visaDurationTypesData) {
      const visaDurationTypeOptions: OptionType[] =
        visaDurationTypesData.data.map((item: any) => ({
          label: `${item.value} ${
            item.Type === "YEARS"
              ? "ساله"
              : item.Type === "MONTHS"
              ? "ماهه"
              : item.Type === "DAYS"
              ? "روزه"
              : ""
          }`.trim(),
          value: item.id.toString(),
          type: item.Type,
        }));

      setVisaDurationTypes(visaDurationTypeOptions);
    }
  }, [visaDurationTypesData]);
  const { data: VisaEntranceTypesData } = useQuery({
    queryKey: ["VisaEntranceTypesData"],
    queryFn: async () => await getVisaEntranceTypes(),
  });
  useEffect(() => {
    if (VisaEntranceTypesData) {
      const visaEntranceTypeOptions: OptionType[] =
        VisaEntranceTypesData.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));

      setVisaEntranceTypes(visaEntranceTypeOptions);
    }
  }, [VisaEntranceTypesData]);
  return (
    <div className="bg-card p-6 rounded-xl flex flex-col gap-4">
      <Button
        variant={"transparent"}
        onClick={addVisaForm}
        className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        <FaPlus />
        اضافه کردن ویزا
      </Button>
      <div className="flex flex-col-reverse gap-4">
        {addedVisas.map((item, index) => (
          <VisaForm
            key={item.id}
            visa={addedVisas[index]}
            itemId={item.id}
            onRemoveHandler={removeHandler}
            currencies={currencies}
            countries={countries}
            visaTypes={visaTypes}
            visaDurationTypes={visaDurationTypes}
            visaEntranceTypes={visaEntranceTypes}
            customers={visaCustomers}
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
