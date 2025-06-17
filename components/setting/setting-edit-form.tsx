import { useFormik } from "formik";
import FormMaker, { OptionType } from "../shared/form-maker";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/api/location";
import { useEffect, useState } from "react";

export default function SettingEditForm({
  fields,
  editData,
  countries,

  airports,
}: {
  fields: any[];
  editData: any;
  countries: any[];

  airports: any[];
}) {
  const [cities, setCities] = useState<OptionType[]>([]);
  const formik = useFormik({
    initialValues: editData,
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
  });
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
  return (
    <div className="w-full">
      <FormMaker
        form={formik}
        fields={[
          {
            key: "country",
            component: "Select",
            placeholder: "کشور",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: countries,
          },
          {
            key: "city",
            component: "Select",
            placeholder: "شهر",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: cities,
          },
          {
            key: "airport",
            component: "SuggestionInput",
            placeholder: "فرودگاه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
            options: airports,
          },

          {
            component: "non-field",
            key: "actions",
            children: (
              <Button variant="info" onClick={() => {}}>
                ثبت ویرایش
              </Button>
            ),
            className: "w-full md:w-1/4",
          },
        ]}
        className="w-full flex flex-row"
      />
    </div>
  );
}
