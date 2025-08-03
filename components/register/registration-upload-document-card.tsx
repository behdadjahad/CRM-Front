import { useFormik } from "formik";

import FormMaker from "../shared/form-maker";

import { Button } from "../ui/button";
import { uploadDocumnets } from "@/api/legal-document";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ServerImageAddress } from "@/lib/utils";

export interface RegistrationUploadDocumentCardInterface {
  id: number;
  title: string;
  data?: {
    id: number;
    documentTypeId: number;
    licenceNumber: string;
    licenseFile: string;
    title: string;
  };
}

export default function RegistrationUploadDocumentCard({
  id,
  title,
  data,
}: RegistrationUploadDocumentCardInterface) {
  const userData = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      id: data?.documentTypeId ? data?.documentTypeId : id,
      // licenseFile: data?.licenseFile ? data?.licenseFile : "",
      licenseFile: data?.licenseFile
        ? { url:  ServerImageAddress + data.licenseFile, file: null }
        : null,
      licenseNumber: data?.licenceNumber ? data?.licenceNumber : "",
      title: data?.title ? data?.title : title,
    },

    onSubmit: async () => {},
  });
  const { mutate: submitUploadedDocumnet } = useMutation({
    mutationFn: (data: any) => {
      return uploadDocumnets(data);
    },
    onSuccess: () => {},
  });
  function submitCompanyDocument(values: any) {
    const data = {
      licenceNumber: values.licenseNumber,
      legalDocumentTypeId: values.id,
      licenseFile: values.licenseFile,
      registerationRequestId: userData.registerationRequestId,
    };
    submitUploadedDocumnet(data);
  }
  return (
    <FormMaker
      form={formik}
      fields={[
        {
          key: "licenseNumber",
          component: "input",
          placeholder: title,
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2",
        },
        {
          key: "licenseFile",
          component: "single-file",
          placeholder: "",
          type: "file",
          floating: true,
          icon: "/icons/vector.png",
          className: "w-fit",
        },
        {
          component: "single-file-preview",
          key: "filePreview",
          dependantKey: "licenseFile",
          className: "w-fit",
        },
        {
          key: "submit",
          component: "non-field",
          children: (
            <Button
              variant={"foreground"}
              onClick={() => {
                submitCompanyDocument(formik.values);
              }}
            >
              ارسال فایل
            </Button>
          ),
          className: "flex-1 flex items-start",
        },
      ]}
      className="flex  flex-row-reverse w-full"
    />
  );
}
