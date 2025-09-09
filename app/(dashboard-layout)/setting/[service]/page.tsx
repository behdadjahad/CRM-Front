"use client";

import { getAccommodationTypes, getHotels } from "@/api/accommodation";
import { getAirlinesData } from "@/api/flight";
import { getCities, getCountries } from "@/api/location";
import { submitAirport } from "@/api/setting-airport";
import { getAirports } from "@/api/ticket";
import SettingCreateForm from "@/components/setting/setting-create-form";
import SettingContainer from "@/components/setting/station/setting-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import Title from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import {
  createSettingFormFields,
  createSettingFormValues,
  getSettingSubmit,
  sliceMap,
} from "@/constants/setting";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ServiceSetting() {
  const pageFeatures = usePageData()



  // const filterAirport=pageFeatures?.find((item : any)=>item.code==="filter-airports")
  // const filterAirport=pageFeatures?.find((item : any)=>item.code==="filter-airports")
  // const filterAirport=pageFeatures?.find((item : any)=>item.code==="filter-airports")


  const dispatch = useDispatch();
  const { service } = useParams();
  const config = sliceMap[service as keyof typeof sliceMap];
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [airports, setAirports] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [airlines, setAirlines] = useState<OptionType[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<OptionType[]>(
    []
  );

  const { data: airlineData } = useQuery({
    queryKey: ["airlines"],
    queryFn: async () => await getAirlinesData(301),
  });



  useEffect(() => {
    if (airlineData && airlineData?.data?.length > 0) {
      const airlinesOptions = airlineData?.data?.map((item: any) => ({
        value: item?.id.toString(),
        label: item?.name,
      }));
      setAirlines(airlinesOptions);
    }
  }, [airlineData]);

  const [hotels, setHotels] = useState<OptionType[]>([]);
  const formik = useFormik({
    initialValues: createSettingFormValues(service),
    onSubmit: () => { },
  });
  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => await getCountries(),
  });
  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
  });
  const { data: hotelData } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getHotels(),
  });
  useEffect(() => {
    if (countryData && countryData?.data?.length > 0) {
      const countryOptions: OptionType[] = countryData?.data?.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setCountries(countryOptions);
    }
  }, [countryData]);
  useEffect(() => {
    if (hotelData && hotelData?.data?.length > 0) {
      const hotelOptions: OptionType[] = hotelData?.data?.flatMap((item: any) =>
        item?.country?.city?.flatMap((city: any) =>
          city?.hotel?.map((hotel: any) => ({
            label: hotel?.name,
            value: hotel?.id?.toString(),
          }))
        )
      );

      setHotels(hotelOptions);
    }
  }, [hotelData]);
  const { data: accommodationType } = useQuery({
    queryKey: ["accomodationType"],
    queryFn: () => getAccommodationTypes(),
  });
  useEffect(() => {
    if (accommodationType) {
      const accommodationOptions = accommodationType?.data?.map(
        (item: any) => ({
          value: item.id.toString(),
          label: item.name,
        })
      );
      setAccommodationTypes(accommodationOptions);
    }
  }, [accommodationType]);
  useEffect(() => {
    if (cityData && cityData?.data?.length > 0) {
      if (!formik.values.country) {
        const cityOptions: OptionType[] = cityData?.data?.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));

        setCities(cityOptions);
      } else {
        const cityOptions: OptionType[] = cityData?.data
          ?.filter((item: any) => item.countryId === formik.values.country)
          .map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setCities(cityOptions);
      }
    }
  }, [cityData, formik.values.country]);

  const { data: airportData } = useQuery({
    queryKey: ["airportData"],
    queryFn: () => getAirports(),
  });

  useEffect(() => {
    if (airportData?.data) {
      const airportOptions = airportData?.data?.map((item: any) => ({
        label: item?.name,
        value: item?.id?.toString(),
      }));
      setAirports(airportOptions);
    }
  }, [airportData]);
  const limit = useSelector((state) => config?.selector(state).limit);
  const { mutate: submitHandler } = useMutation({
    mutationFn: (data: any) => {
      return getSettingSubmit(service, data);
    },
    onSuccess: () => {
      (dispatch as any)(
        config.fetchAction({
          page: 1,
          limit: limit,
          filters: {},
        })
      );
      formik.resetForm();
    },
  });
  function submit(data: any) {
    submitHandler(data);
  }

  const pathname = usePathname();
  const serviceType = pathname?.split("/").pop(); // "hotel" | "airport" | "airline"

  const featureCodeMap: Record<string, string> = {
    hotel: "create-accommodations",
    airport: "create-airports",
    airline: "create-airlines"
  };
  console.log("hiiiii",)
  // decide if form should be shown
  const shouldShowForm =
    generateFeatureAccess(
      pageFeatures,
      featureCodeMap[serviceType!]
    )?.show &&
    generateFeatureAccess(
      pageFeatures,
      featureCodeMap[serviceType!]
    )?.enable;

  // If user doesn't have access, disable the form
  const isDisabled = true;

  console.log("serviceType", serviceType)
  console.log("shouldShowForm", shouldShowForm)
  console.log("isDisabled", isDisabled)

  return (
    <main>
      <Title label="ثبت اطلاعات سرویس" />
      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "اطلاعات سرویس",
          },
        ]}
      />

      {/* {shouldShowForm && ( */}
      <SettingCreateForm
        fields={createSettingFormFields(
          service,
          countries,
          cities,
          airports,
          accommodationTypes,
          hotels,
          airlines,
          isDisabled
        )}
        hasAccess={shouldShowForm}
        form={formik}
        title={service}
        onSubmitHandler={(data) => submit(data)}
      />
      {/* )} */}
      <SettingContainer
        countries={countries}
        cities={cities}
        airports={airports}
        accommodationTypes={accommodationTypes}
        hotels={hotels}
        airlines={airlines}
      />
    </main>
  );
}
