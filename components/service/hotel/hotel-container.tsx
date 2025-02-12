import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import HotelForm from "./hotel-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAccommodationTypes,
  getHotels,
  getServiceTypes,
} from "@/api/accommodation";
import { OptionType } from "@/components/shared/form-maker";
import { useParams } from "next/navigation";
import RegisteryForm from "@/components/contract/registery-form";
import { insertSubmitterData } from "@/api/client";
import { getContractById } from "@/api/contract";
import { getUsers } from "@/api/auth";
export default function HotelContainer() {
  const { id } = useParams();

  const [formKeys, setFormKeys] = useState<string[]>([`new-hotel-form-1`]);

  const [countries, setCountries] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [hotels, setHotels] = useState<OptionType[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<OptionType[]>(
    []
  );
  const [serviceTypes, setServiceTypes] = useState<OptionType[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);

  const { mutate: SubmitterHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertSubmitterData(data, Number(id));
    },
    onSuccess: () => {},
  });
  const { data: hotelsData } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getHotels(),
  });
  useEffect(() => {
    if (hotelsData) {
      const countryOptions: OptionType[] = hotelsData.data.map((item: any) => ({
        value: item.country.id.toString(),
        label: item.country.name,
        cities: item.country.city.map((item: any) => ({
          label: item.name,
          value: item.id,
          hotels: item.hotel.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        })),
      }));
      const cityOptions = hotelsData.data.flatMap((item: any) =>
        item.country.city.map((city: any) => ({
          value: city.id.toString(),
          label: city.name,
          hotels: city.hotel.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        }))
      );
      const hotelOptions = hotelsData.data.flatMap((item: any) =>
        item.country.city.flatMap((city: any) =>
          city.hotel.map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        )
      );
      setCountries(countryOptions);
      setCities(cityOptions);
      setHotels(hotelOptions);
    }
  }, [hotelsData]);
  const { data: accommodationType } = useQuery({
    queryKey: ["accomodationType"],
    queryFn: () => getAccommodationTypes(),
  });
  useEffect(() => {
    if (accommodationType) {
      const accommodationOptions = accommodationType.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setAccommodationTypes(accommodationOptions);
    }
  }, [accommodationType]);
  const { data: serviceTypesData} = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => await getServiceTypes(),
  });
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
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
  useEffect(() => {
    if (serviceTypesData?.data) {
      const serviceOptions = serviceTypesData.data.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      console.log(serviceOptions);
      setServiceTypes(serviceOptions);
    }
  }, [serviceTypesData]);

  function addHotelForm() {
    const key = `new-hotel-form-${formKeys.length + 1}`;
    setFormKeys([...formKeys, key]);
  }

  return (
    <div>
      <Button
        variant={"transparent"}
        onClick={addHotelForm}
        className={cn("mr-auto text-aqua-foreground")}
      >
        <FaPlus />
          اضافه کردن اقامتگاه
      </Button>

      { formKeys.map((item) => (
        <HotelForm
          key={item}
          id={item}
          cities={cities}
          countries={countries}
          serviceTypes={serviceTypes}
          hotels={hotels}
          accommodationTypes={accommodationTypes}
        />
      ))}
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
  );
}
