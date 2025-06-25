import { useFormik } from "formik";
import FormMaker, { FieldType, OptionType } from "../shared/form-maker";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCities } from "@/api/location";
import { useEffect, useState } from "react";
import {
  createSettingEditFormFields,
  createSettingSubmitData,
  getSettingEdit,
  sliceMap,
} from "@/constants/setting";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function SettingEditForm({
  countries,
  airports,
  editData,
  accommodationTypes,
  hotels,
  airlines,
  onCloseEditForm
}: {
  countries: any;
  airports: any;
  editData: any;
  accommodationTypes: any;
  hotels: any;
    airlines: any;
    onCloseEditForm: any;
}) {
  const dispatch = useDispatch<any>();
  const { service } = useParams();
  const config = sliceMap[service as keyof typeof sliceMap];
  const currentPage = useSelector(
    (state) => config?.selector(state).currentPage
  );
  const limit = useSelector((state) => config?.selector(state).limit);
  const filters = useSelector((state) => config?.selector(state).filters);
  const [cities, setCities] = useState<OptionType[]>([]);

  const formik = useFormik({
    initialValues: editData,
    onSubmit: () => {},
  });
  const { mutate: editHandler } = useMutation({
    mutationFn: (item: number) => {
      return getSettingEdit(
        service,
        item,
        createSettingSubmitData(service, formik)
      );
    },
    onSuccess: () => {
      (dispatch as any)(
        config.fetchAction({
          page: currentPage,
          limit: limit,
          filters: filters,
        })
      );
      onCloseEditForm(editData?.id)
    },
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
          ...(createSettingEditFormFields(
            service,
            countries,
            cities,
            airports,
            accommodationTypes,
            hotels,
            airlines
          ) as FieldType[]),
          {
            component: "non-field",
            key: "actions",
            children: (
              <Button
                variant="info"
                onClick={() => {
                  editHandler(editData.id);
                }}
              >
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
