import { useFormik } from "formik";

import FormMaker from "../shared/form-maker";
import { useEffect } from "react";

export interface RegistrationUploadDocumentCardInterface {
  id: number;
  title: string;
  onChange: ({
    id,
    licenseNumber,
    licensefile,
  }: {
    id: number;
    licenseNumber: string;
    licensefile: any;
  }) => void;
}

export default function RegistrationUploadDocumentCard({
  id,
  title,
  onChange,
}: RegistrationUploadDocumentCardInterface) {
  const formik = useFormik({
    initialValues: {
      id: id,
      licensefile: "",
      licenseNumber: "",
    },
    validate: (values) => {
      // notify parent whenever any field changes
      onChange(values);
      return {};
    },
    onSubmit: async () => {},
  });
  // useEffect(() => {
  //   onChange(formik.values);
  // }, [formik.values, onChange]);
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
      className="flex  flex-row-reverse w-full "
    />
  );
}
