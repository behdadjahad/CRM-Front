import FormMaker from "../shared/form-maker";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";


import CustomerSuggestionInfiniteContainer from "./customer-suggestion-infinite-container";

export default function CustomerSubmitterContainer({
  formik,
}: {
  formik?: any;
}) {
  const [customerValues, setCustomerValues] = useState({});

  const debouncedSuggestion = useCallback(
    debounce((values: any) => {
      const data = {
        firstName: values.clientName,
        lastName: values.clientFamily,
        idNumber: values.clientSSD,
        phone: values.clientPhoneNumber,
        email: values.clientEmail,
      };
      setCustomerValues(data);
    }, 1000),
    []
  );

  useEffect(() => {
    console.log(Object.values(formik.touched));
    debouncedSuggestion(formik.values);
    return () => debouncedSuggestion.cancel();
  }, [formik.values, debouncedSuggestion]);
  function fillCustomerHandler(data: any) {
    const values = {
      clientName: data.firstName || "",
      clientFamily: data.lastName || "",
      clientSSD: data.idNumber || "",
      clientPhoneNumber: data.phone || "",
      clientEmail: data.email || "",
    };
    formik.setValues(values);
  }

  return (
    <div className="w-full flex flex-col  gap-8">
      <FormMaker
        form={formik}
        fields={[
          {
            key: "clientName",
            component: "input",
            placeholder: "نام",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "clientFamily",
            component: "input",
            placeholder: "نام خانوادگی",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "clientSSD",
            component: "input",
            placeholder: "کدملی",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "clientPhoneNumber",
            component: "input",
            placeholder: "شماره تماس",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "clientEmail",
            component: "input",
            placeholder: "ایمیل",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
        ]}
        className="flex flex-row w-full"
      />
      <CustomerSuggestionInfiniteContainer
        data={customerValues}
        onFillCustomerHandler={fillCustomerHandler}
      />
    </div>
  );
}
