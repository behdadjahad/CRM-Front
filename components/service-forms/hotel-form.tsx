import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import FormExtender, { FormExtenderInterface } from "../shared/form-extender";
//import RegisteryForm from "../contract/registery-form";
import FormMaker, { OptionType } from "../shared/form-maker";
import { purchaseInfo } from "@/constants/service-form-fields";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/api/hotel";

export default function HotelForm() {
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [fetchFormValues, setFetchFormValues] = useState(false);

  const roomForm: FormExtenderInterface = {
    title: "مدت اقامت (رزرو اتاق)",
    fields: [
      {
        key: "roomType",
        component: "Select",
        placeholder: "نوع اتاق",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "contractDateIn",
        component: "date",
        placeholder: "چک کردن",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "contractDateOut",
        component: "date",
        placeholder: "چک کردن",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },

      {
        key: "clientName",
        component: "input",
        placeholder: "نام مشتری",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
    ],
    initialValues: {
      roomType: "",
      contractDateIn: "",
      contractDateOut: "",
      clientName: "",
    },
    validationSchema: Yup.object().shape({
      roomType: Yup.string().required(REQUIRED_TEXT),
      contractDateIn: Yup.string().required(REQUIRED_TEXT),
      contractDateOut: Yup.string().required(REQUIRED_TEXT),
      clientName: Yup.string().required(REQUIRED_TEXT),
    }),
    fetchFormValues: false,
    callbackSubmit: submitForm,
  };

  const hotelForm: FormExtenderInterface = {
    title: "سرویس هتل",
    fields: [
      {
        key: "country",
        component: "Select",
        placeholder: "کشور",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
        options: countryOptions,
      },
      {
        key: "city",
        component: "Select",
        placeholder: "شهر",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "hotelName",
        component: "input",
        placeholder: "نام هتل",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "serviceType",
        component: "Select",
        placeholder: "نوع خدمات",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "voucherFile",
        component: "file",
        placeholder: "",
        type: "file",
        floating: true,
        icon: "/icons/upload.png",
        className: "w-full md:w-1/3",
      },
      {
        component: "file-preview",
        key: "filePreview",
        dependantKey: "voucherFile",
        className: "w-full",
      },
    ],
    initialValues: {
      country: "",
      city: "",
      hotelName: "",
      serviceType: "",
      voucherFile: "",
    },
    validationSchema: Yup.object().shape({
      province: Yup.string().required(REQUIRED_TEXT),
      city: Yup.string().required(REQUIRED_TEXT),
      street: Yup.string().required(REQUIRED_TEXT),
      postalCode: Yup.string().required(REQUIRED_TEXT),
      category: Yup.string().required(REQUIRED_TEXT),
      address: Yup.string().required(REQUIRED_TEXT),
    }),
    fetchFormValues: false,
    callbackSubmit: submitForm,
  };
  const { data: hotels } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getHotels(),
  });

  useEffect(() => {
    if (hotels) {
      const countries = hotels.data.map((item: any) => ({
        value: item.country.id.toString(),
        label: item.country.name,
        city: []
      }));
      
      setCountryOptions(countries);
    }
  }, [hotels]);

  const { data: serviceTypes } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => await getHotels(),
  });

  useEffect(() => {
    if (serviceTypes) {
      console.log(serviceTypes);
    }
  }, [hotels]);
  let formValues = {};

  function submitForm(key: string, data: any) {
    formValues = {
      ...formValues,
      [key]: data,
    };
    console.log(formValues);
    setFetchFormValues(false);
  }

  const purchaseFormik = useFormik({
    initialValues: {
      costPerNight: "",
      currency: "",
      broker: "",
    },
    onSubmit: async () => {},
  });

  return (
    <div className="w-full bg-card rounded-lg">
      <div className="w-full p-4">
        <div className="flex flex-row text-xs md:text-sm md:p-4 md:gap-4 font-foreground">
          <RadioGroup
            defaultValue="hotel"
            className="flex flex-row-reverse gap-4 min-h-10"
          >
            <div className="flex items-center space-x-2">
              <label htmlFor="hotel">هتل</label>
              <RadioGroupItem value="hotel" id="hotel" />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="apartment">آپارتمان</label>
              <RadioGroupItem value="apartment" id="apartment" />
            </div>
          </RadioGroup>
        </div>

        <FormExtender
          key={hotelForm.title}
          {...hotelForm}
          fetchFormValues={fetchFormValues}
          wrapperClassName="flex-row flex-wrap"
          childrenClassName="order-last"
        >
          <FormExtender
            key={roomForm.title}
            {...roomForm}
            fetchFormValues={fetchFormValues}
            wrapperClassName="flex-row flex-wrap"
            childrenClassName="order-first"
          >
            <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
              <div className="px-2 font-foreground font-semibold">خرید</div>
              <FormMaker form={purchaseFormik} fields={purchaseInfo} />
            </div>
          </FormExtender>
        </FormExtender>

        <div className="flex flex-col gap-4 px-4">
          {/* <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">خرید</div>
            <FormMaker form={purchaseFormik} fields={purchaseInfo} />
          </div> */}
          <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">
              اطلاعات مشتری (ثبت کننده)
            </div>

            {/* <RegisteryForm /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
