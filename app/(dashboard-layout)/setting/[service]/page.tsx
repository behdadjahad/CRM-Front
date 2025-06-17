"use client";

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
} from "@/constants/setting";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServiceSetting() {
  const { service } = useParams();
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const formik = useFormik({
    initialValues: createSettingFormValues(service),
    onSubmit: () => {},
  });
  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => await getCountries(),
  });
  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
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
  const [airports, setAirports] = useState<OptionType[]>([]);

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
  const { mutate: submitAirportHandler } = useMutation({
    mutationFn: (data: any) => {
      return submitAirport(data);
    },
    onSuccess: () => {},
  });
  // function submitHandler() {
  //   const data = {
  //     name: formik.values.airport,
  //     transportationTypeId: 301,
  //     countryId: formik.values.country,
  //     cityId: formik.values.city,
  //   };
  //   submitAirportHandler(data);
  // }


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
      <SettingCreateForm
        fields={createSettingFormFields(service, countries, cities, airports)}
        form={formik}
        title={service}
      />
      <SettingContainer countries={countries} cities={cities} airports={airports} />
    </main>
  );
}
