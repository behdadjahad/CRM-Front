"use client";

import { useFormik } from "formik";
import FormTabContainer from "../shared/form-tab-container";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/registration-creation-form-fields";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLegalDocumentTypes } from "@/api/legal-document";

import { useEffect, useState } from "react";
import RegistrationUploadDocumentContainer from "./registration-upload-document-container";
import { addCeoCommunication, addCeoDetail, addCompanyInfo } from "@/api/ceo";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { convertToGregorian } from "@/lib/date";

export default function RegistrationContainer() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const { data: legalDocumentTypeData } = useQuery({
    queryKey: ["legalDocumentTypeData"],
    queryFn: async () => await getLegalDocumentTypes(),
  });
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (legalDocumentTypeData && legalDocumentTypeData?.data?.length > 0) {
      const documentTypeOptions = legalDocumentTypeData?.data?.map(
        (item: any) => ({
          id: item?.id,
          title: item?.title,
        })
      );
      setDocumentTypes(documentTypeOptions);
    }
  }, [legalDocumentTypeData]);
  const {
    managerPersonalFormikData,
    managerContactFormikData,
    companyInfoFormikData,
    companyContactFormikData,
  } = getData();
  const formik = useFormik({
    initialValues: managerPersonalFormikData.initialValues,

    onSubmit: async () => {},
  });
  const { mutate: submitManagerInfoHandler } = useMutation({
    mutationFn: (data: any) => {
      return addCeoDetail(data);
    },
    onSuccess: () => {},
  });
  const { mutate: submitManagerCommunicationHandler } = useMutation({
    mutationFn: (data: any) => {
      return addCeoCommunication(data);
    },
    onSuccess: () => {},
  });
  const { mutate: submitCompanyInfoHandler } = useMutation({
    mutationFn: (data: any) => {
      return addCompanyInfo(data);
    },
    onSuccess: () => {},
  });
  function submitManager() {
    const data = {
      // chadcoCustomerId: "",
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      // fullName:"" ,
      birthDate: convertToGregorian(
        formik.values.managerBirthDate,
        formik.values.managerBirthDateType
      ),
      nationalId: formik.values.idNumber,
      registerationRequestId: userData.registerationRequestId,
    };
    submitManagerInfoHandler(data);
  }
  function submitCommunication() {
    const data = [
      {
        communicationDetails: "string",
        communicationType: "MOBILE",
        communicater: "ORGANIZATION",
        customerId: 1,
        organizationId: 1,
      },
      {
        communicationDetails: "string",
        communicationType: "MOBILE",
        communicater: "ORGANIZATION",
        customerId: 1,
        organizationId: 1,
      },
      {
        communicationDetails: "string",
        communicationType: "MOBILE",
        communicater: "ORGANIZATION",
        customerId: 1,
        organizationId: 1,
      },
      {
        communicationDetails: "string",
        communicationType: "MOBILE",
        communicater: "ORGANIZATION",
        customerId: 1,
        organizationId: 1,
      },
    ];

    submitManagerCommunicationHandler(data);
  }
  function submitCompany() {
    const data = {};
    submitCompanyInfoHandler(data);
  }
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
                  form: formik,
                  fields: managerPersonalFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {
                  submitManager();
                },
              },
              {
                title: "اطلاعات تماس",
                formInfo: {
                  form: formik,
                  fields: managerContactFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {
                  submitCommunication();
                },
              },
            ],
          },
          {
            title: "اطلاعات آژانس گردشگری",
            forms: [
              {
                title: "اطلاعات شرکت",
                formInfo: {
                  form: formik,
                  fields: companyInfoFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {
                  submitCompany();
                },
              },
              {
                title: "اطلاعات تماس",
                formInfo: {
                  form: formik,
                  fields: companyContactFormikData.fields,
                  className: "flex flex-row-reverse",
                },
                submitForm: () => {},
              },
            ],
          },
          {
            title: "آپلود مدارک",
            forms: [
              // {
              //   title: "مدارک شرکت",
              //   formInfo: {
              //     form: managerFormik,
              //     fields: companyDocumentFormikData.fields,
              //     className: "flex flex-row-reverse",
              //   },
              //   submitForm: () => {},
              // },
            ],
            children: (
              <RegistrationUploadDocumentContainer list={documentTypes} />
            ),
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
  const companyContactFormikData: formDataInterface =
    createFormFields("companyContact");
  const companyDocumentFormikData: formDataInterface = {
    fields: [],
    initialValues: {},
  };

  return {
    managerPersonalFormikData,
    managerContactFormikData,
    companyInfoFormikData,
    companyContactFormikData,
  };
}
