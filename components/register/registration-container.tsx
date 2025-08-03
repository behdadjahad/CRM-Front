"use client";

import { useFormik } from "formik";
import FormTabContainer from "../shared/form-tab-container";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/registration-creation-form-fields";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getLegalDocuments,
  getLegalDocumentTypes,
  uploadDocumnets,
} from "@/api/legal-document";

import { useEffect, useState } from "react";
import RegistrationUploadDocumentContainer from "./registration-upload-document-container";
import { addCeoCommunication, addCeoDetail } from "@/api/ceo";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { convertDate, convertToGregorian } from "@/lib/date";
import { getRegistrationData, updateRegistrationData } from "@/api/signup";
import { Communicater, CommunicationType } from "@/types/globals";
import { fetchCountries } from "@/store/country-slice";
import { fetchCities } from "@/store/city-slice";
import { fetchProvinces } from "@/store/province-slice";
import { OptionType } from "../shared/form-maker";
import { dateType } from "@/lib/utils";
import { useRouter } from "next/router";

export default function RegistrationContainer() {
 
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchCities());
    dispatch(fetchProvinces());
  }, [dispatch]);
  const countryOptions = useSelector((state: any) => state?.country?.items);
  const cityOptions = useSelector((state: any) => state?.city?.items);
  const provinceOptions = useSelector((state: any) => state?.province?.items);
  const [provinces, setProvinces] = useState<OptionType[]>(provinceOptions);
  const [cities, setCities] = useState<OptionType[]>(cityOptions);
  const [ceoDetail, setCeoDetail] = useState<any>({});
  const [companyDetail, setCompanyDetail] = useState<any>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const {
    managerPersonalFormikData,
    managerContactFormikData,
    companyInfoFormikData,
    companyContactFormikData,
  } = getData();
  const formik = useFormik({
    initialValues: {
      firstName: ceoDetail?.firstName,
      lastName: ceoDetail?.lastName,
      idNumber: ceoDetail?.nationalId,
      managerBirthDate: ceoDetail?.birthDate,
      managerBirthDateType: dateType,
      mobilePhone: "",
      homePhone: "",
      workPhone: "",
      email: "",
      companyName: companyDetail?.companyName,
      brandName: companyDetail?.brandName,
      registrationNumber: companyDetail?.registrationNumber,
      economicCode: companyDetail?.economicCode,
      companyType: companyDetail?.companyType,
      companyIdNumber: companyDetail?.companyIdNumber,
      address: companyDetail?.address,
      description: companyDetail?.description,
      logoFile: "",
      establishedDate: companyDetail?.establishedDate
        ? convertDate(companyDetail?.establishedDate, dateType)
        : "",
      establishedDateType: dateType,
      city: companyDetail?.city,
      province: companyDetail?.province,
      country: companyDetail?.country,
      companyPhoneNumber: companyDetail?.phoneNumber,
      companyEmail: companyDetail?.email,
      companyWebsite: companyDetail?.website,
    },
    enableReinitialize: true,
    onSubmit: async () => {},
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [ceoId, setCeoId] = useState<number | null>(null);

  const { data: legalDocumentTypeData } = useQuery({
    queryKey: ["legalDocumentTypeData"],
    queryFn: async () => await getLegalDocumentTypes(),
  });
  const userData = useSelector((state: RootState) => state.user);
  const { data: legalDocuments } = useQuery({
    queryKey: ["legalDocuments", , userData.registerationRequestId],
    queryFn: async () =>
      await getLegalDocuments(userData.registerationRequestId),
    enabled: !!userData.registerationRequestId,
  });
  useEffect(() => {
    if (legalDocuments && legalDocuments?.data?.length > 0) {
      const documents = legalDocuments?.data?.map((doc: any) => ({
        id: doc?.id,
        documentTypeId: doc?.legalDocumentTypeId,
        licenceNumber: doc?.licenceNumber,
        licenseFile: doc?.licenceFileUrl,
        title: doc?.title,
      }));
      setUploadedDocuments(documents);
    }
  }, [legalDocuments]);
  const { data: registrationData } = useQuery({
    queryKey: ["registrationData", userData.registerationRequestId],
    queryFn: async () =>
      await getRegistrationData(userData.registerationRequestId),
    enabled: !!userData.registerationRequestId, // will only run if requestId is not undefined or falsy
  });

  useEffect(() => {
    if (registrationData) {
      const ceo = registrationData?.data?.CEO?.id;
      setCeoId(ceo);
      const ceoInfo = {
        firstName: registrationData?.data?.CEO?.firstName,
        lastName: registrationData?.data?.CEO?.lastName,
        nationalId: registrationData?.data?.CEO?.nationalId,
        birthDate: registrationData?.data?.CEO?.birthDate
          ? convertDate(registrationData?.data?.CEO?.birthDate, dateType)
          : "",
      };
      const companyInfo = {
        companyName: registrationData?.data?.companyName,
        brandName: registrationData?.data?.brandName,
        economicCode: registrationData?.data?.economicCode,
        city: registrationData?.data?.cityId,
        province: registrationData?.data?.provinceId,
        country: registrationData?.data?.countryId,
        companyType: registrationData?.data?.companyType,
        address: registrationData?.data?.address,
        establishedDate: registrationData?.data?.establishedDate,
        description: registrationData?.data?.description,
        companyIdNumber: registrationData?.data?.nationalId,
        registrationNumber: registrationData?.data?.registerationNumber,
        email: registrationData?.data?.email,
        website: registrationData?.data?.website,
        phoneNumber: registrationData?.data?.phoneNumber,
      };
      setCeoDetail(ceoInfo);
      setCompanyDetail(companyInfo);
    }
  }, [registrationData]);

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

  useEffect(() => {
    if (formik.values.country) {
      const provinceList = provinceOptions?.filter(
        (item: any) => item.countryId === formik.values.country
      );
      setProvinces(provinceList);
    } else {
      setProvinces(provinceOptions);
    }
  }, [countryOptions, formik.values.country]);
  useEffect(() => {
    if (formik.values.province) {
      const cityList = cityOptions?.filter(
        (item: any) => item?.provinceId === formik.values.province
      );
      setCities(cityList);
    } else {
      setCities(cityOptions);
    }
  }, [provinceOptions, formik.values.province]);

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
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return updateRegistrationData(id, data);
    },
    onSuccess: () => {
        
    },
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
    if (ceoId) {
      submitCompanyInfoHandler({
        id: userData.registerationRequestId,
        data: data,
      });
    } else {
      submitManagerInfoHandler(data);
    }
  }
  function submitCommunication() {
    const data = [
      {
        communicationDetails: formik.values.mobilePhone,
        communicationType: CommunicationType.mobile,
        communicater: Communicater.business,
        ceoId: ceoId,
      },
      {
        communicationDetails: formik.values.homePhone,
        communicationType: CommunicationType.home,
        communicater: Communicater.business,
        ceoId: ceoId,
      },
      {
        communicationDetails: formik.values.workPhone,
        communicationType: CommunicationType.business,
        communicater: Communicater.business,
        ceoId: ceoId,
      },
      {
        communicationDetails: formik.values.email,
        communicationType: CommunicationType.email,
        communicater: Communicater.business,
        ceoId: ceoId,
      },
    ];

    submitManagerCommunicationHandler(data);
  }
  function submitCompany() {
    const data = {
      ...(formik.values.companyName
        ? { companyName: formik.values.companyName }
        : {}),
      brandName: formik.values.brandName,
      registerationNumber: formik.values.registrationNumber,
      nationalId: formik.values.companyIdNumber,
      economicCode: formik.values.economicCode,
      companyType: formik.values.companyType,
      address: formik.values.address,
      description: formik.values.description,
      logoFile: formik.values.logoFile,
      establishedDate: convertToGregorian(
        formik.values.establishedDate,
        formik.values.establishedDateType
      ),
      ...(formik.values.city ? { cityId: formik.values.city } : {}),
      ...(formik.values.province ? { provinceId: formik.values.province } : {}),
      ...(formik.values.country ? { countryId: formik.values.country } : {}),
    };
    submitCompanyInfoHandler({
      id: userData.registerationRequestId,
      data: data,
    });
  }
  function submitCompanyContact() {
    const data = {
      phoneNumber: formik.values.companyPhoneNumber,
      email: formik.values.companyEmail,
      website: formik.values.companyWebsite,
    };
    submitCompanyInfoHandler({
      id: userData.registerationRequestId,
      data: data,
    });
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
                submitForm: () => {
                  submitCompanyContact();
                },
              },
            ],
          },
          {
            title: "آپلود مدارک",
            forms: [],
            children: (
              <RegistrationUploadDocumentContainer
                list={documentTypes}
                uploadedDocuments={uploadedDocuments}
              />
            ),
          },
        ]}
      />
    </div>
  );
  function getData() {
    const managerPersonalFormikData: formDataInterface =
      createFormFields("managerPersonal");
    const managerContactFormikData: formDataInterface =
      createFormFields("managerContact");
    const companyInfoFormikData: formDataInterface = createFormFields(
      "companyInfo",
      countryOptions,
      provinces,
      cities
    );
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
}
