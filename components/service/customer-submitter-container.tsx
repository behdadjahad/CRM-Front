import FormMaker from "../shared/form-maker";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

import CustomerSuggestionInfiniteContainer from "./customer-suggestion-infinite-container";
import { useFormik } from "formik";
import { CustomerDataInterface } from "./customer-infinite-card";
export interface CustomerSubmitterContainerInterface {
  onSendCustomerData: (data: CustomerDataInterface) => void;
}
export default function CustomerSubmitterContainer({
  onSendCustomerData,
}: CustomerSubmitterContainerInterface) {
  const [customerValues, setCustomerValues] = useState({});
  const [state, setState] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      email: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const debouncedSuggestion = useCallback(
    debounce((values: CustomerDataInterface) => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        idNumber: values.idNumber,
        phone: values.phone,
        email: values.email,
      };
      setCustomerValues(data);
      onSendCustomerData(data);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSuggestion(formik.values);
    return () => {
      debouncedSuggestion.cancel();
    };
  }, [formik.values, debouncedSuggestion]);

  useEffect(() => {
    const hasAnyNonEmptyField = Object.values(formik.values).some(
      (value) => value !== ""
    );
    if (hasAnyNonEmptyField) {
      setState(true);
    } else {
      setState(false);
    }
  }, [formik.values]);

  function fillCustomerHandler(data: CustomerDataInterface) {
    const values = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      idNumber: data.idNumber || "",
      phone: data.phone || "",
      email: data.email || "",
    };
    formik.setValues(values);
  }

  return (
    <div className="w-full flex flex-col  gap-8">
      <FormMaker
        form={formik}
        fields={[
          {
            key: "firstName",
            component: "input",
            placeholder: "نام",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "lastName",
            component: "input",
            placeholder: "نام خانوادگی",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "idNumber",
            component: "input",
            placeholder: "کدملی",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "phone",
            component: "input",
            placeholder: "شماره تماس",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
          {
            key: "email",
            component: "input",
            placeholder: "ایمیل",
            type: "text",
            floating: true,
            className: "w-full md:w-1/2",
          },
        ]}
        className="flex flex-row w-full"
      />
      {state && (
        <CustomerSuggestionInfiniteContainer
          data={customerValues}
          onFillCustomerHandler={fillCustomerHandler}
        />
      )}
    </div>
  );
}
