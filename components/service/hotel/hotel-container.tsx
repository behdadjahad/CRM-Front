import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import HotelForm from "./hotel-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteHotelData,
  getAccommodationTypes,
  getHotels,
  getServiceTypes,
  getSubmittedHotels,
} from "@/api/accommodation";
import { OptionType } from "@/components/shared/form-maker";
import { useParams } from "next/navigation";
import RegisteryForm from "@/components/contract/registery-form";
import { insertSubmitterData } from "@/api/client";
import { getContractById } from "@/api/contract";
import { getUsers } from "@/api/auth";
export default function HotelContainer() {
  const { id } = useParams();

  const [addedHotels, setAddedHotels] = useState<any[]>([]);

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
        cities: item.country.city.map((city: any) => ({
          label: city.name,
          value: city.id,
          hotels: city.hotel.map((hotel: any) => ({
            label: hotel.name,
            value: hotel.id,
            accommodationId: hotel.AccommodationAcType.accomodationType.id, // Optional chaining in case it's undefined
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
            accommodationId: item.AccommodationAcType.accomodationType.id,
          })),
        }))
      );

      const hotelOptions = hotelsData.data.flatMap((item: any) =>
        item.country.city.flatMap((city: any) =>
          city.hotel.map((hotel: any) => ({
            label: hotel.name,
            value: hotel.id.toString(),
            accommodationId: hotel.AccommodationAcType.accomodationType.id,
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
  const { data: serviceTypesData } = useQuery({
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
      setServiceTypes(serviceOptions);
    }
  }, [serviceTypesData]);

  const { data: submittedHotels, isLoading: isHotelLoading } = useQuery({
    queryKey: ["submittedHotels"],
    queryFn: () => getSubmittedHotels(Number(id) as number),
  });

  useEffect(() => {
    if (isHotelLoading) return;
    if (submittedHotels?.data?.length) {
      setAddedHotels(
        submittedHotels.data.map((item: any) => ({
          city: item?.accommodation?.cityId.toString(),
          country: item?.accommodation?.countryId.toString(),
          hotel: item?.accommodation?.id.toString(),
          serviceType: item.serviceTypeId,
          id: item.id,
          isSubmitted: true,
          accommodationType:
            item.accommodation.AccommodationAcType.accomodationType.id.toString(),
        }))
      );
    } else {
      setAddedHotels([
        {
          id: `hotel-1`,
          city: null,
          country: null,
          hotel: null,
          serviceType: null,
          isSubmitted: false,
        },
      ]);
    }
  }, [submittedHotels, isHotelLoading]);

  function addHotelForm() {
    setAddedHotels([
      ...addedHotels,
      {
        id: `hotel-${addedHotels.length + 1}`,
        city: null,
        country: null,
        hotel: null,
        serviceType: null,
        isSubmitted: false,
      },
    ]);
  }
  const { mutate: removeHotel } = useMutation({
    mutationFn: (id: number) => {
      return deleteHotelData(id);
    },
    onSuccess: () => {},
  });
  function removeHandler(formId: string | number) {
    const selectedHotel = addedHotels.find((item) => item.id == formId);
    if (selectedHotel.isSubmitted) {
      removeHotel(selectedHotel.id);
      const updatedAddedHotels = addedHotels.filter(
        (item) => item.id != formId
      );
      setAddedHotels(updatedAddedHotels);
    } else if (addedHotels.length > 1) {
      const updatedAddedHotels = addedHotels.filter(
        (item) => item.id != formId
      );
      setAddedHotels(updatedAddedHotels);
    } else return;
  }

  return (
    <div className="bg-transparent p-6 rounded-xl flex flex-col gap-4">
      <Button
        variant={"transparent"}
        onClick={addHotelForm}
        className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        <FaPlus />
        اضافه کردن اقامتگاه
      </Button>
      <div className="flex flex-col-reverse">
        {addedHotels.map((item, index) => (
          <HotelForm
            key={item.id}
            itemId={item.id}
            cities={cities}
            countries={countries}
            serviceTypes={serviceTypes}
            hotels={hotels}
            accommodationTypes={accommodationTypes}
            onRemoveHandler={removeHandler}
            hotel={addedHotels[index]}
            className=""
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
