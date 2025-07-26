"use client";

import { useFormik } from "formik";
import FormTabContainer from "../shared/form-tab-container";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/registration-creation-form-fields";

export default function RegistrationContainer() {
  const { managerPersonalFormikData, managerContactFormikData ,companyInfoFormikData} = getData();
  const managerFormik = useFormik({
    initialValues:managerPersonalFormikData.initialValues,

    onSubmit: async () => {},
  });
  return (
    <div>
      <FormTabContainer
        defaultValue="اطلاعات مدیر عامل"
        tabs={[
          {
            title: "اطلاعات مدیر عامل",
            forms: [
              {
                title: "اطلاعات شخصی",
                formInfo: {
                  form: managerFormik,
                  fields: managerPersonalFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {},
              },
              {
                title: "اطلاعات تماس",
                formInfo: {
                  form: managerFormik,
                  fields: managerContactFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {},
              },
            ],
          },
          {
            title: "اطلاعات آژانس گردشگری",
            forms: [
              {
                title: "اطلاعات شرکت",
                formInfo: {
                  form: managerFormik,
                  fields: companyInfoFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {},
              },
            ],
          },
          {
            title: "آپلود مدارک",
            forms: [
              {
                title: "اطلاعات شخصی",
                formInfo: {
                  form: managerFormik,
                  fields: managerContactFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {},
              },
            ],
          },
        ]}
      />
    </div>
  );
}
export function getData() {
  const managerPersonalFormikData: formDataInterface =
    createFormFields("managerPersonal");
  const managerContactFormikData: formDataInterface =
    createFormFields("managerContact");
  const companyInfoFormikData: formDataInterface =
    createFormFields("companyInfo");
  return {
    managerPersonalFormikData,
    managerContactFormikData,
    companyInfoFormikData
  };
}
