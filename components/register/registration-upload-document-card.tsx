import { useFormik } from "formik";

import FormMaker from "../shared/form-maker";

export interface RegistrationUploadDocumentCardInterface {
  id: number;
  title: string;
}

export default function RegistrationUploadDocumentCard({
  id,
  title,
}: RegistrationUploadDocumentCardInterface) {
  const formik = useFormik({
    initialValues: {
      id: id,
      licensefile: "",
      licenseNumber: "",
    },
    onSubmit: async () => {},
  });
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
          className: "w-full md:w-1/4",
        },
        {
          key: "licensefile",
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
          dependantKey: "licensefile",
          className: "w-fit",
        },
      ]}
      className="flex flex-row-reverse w-full"
    />
  );
}
