import { useFormik } from "formik";

import FormMaker from "../shared/form-maker";
import RegistrationUploadDocumentCard from "./registration-upload-document-card";

export interface RegistrationUploadDocumentInterface {
  list: {
    id: number;
    title: string;
    required: boolean;
  }[];
}

export default function RegistrationUploadDocumentContainer({
  list,
}: RegistrationUploadDocumentInterface) {
  const formik = useFormik({
    initialValues: {
    id: "",
    file: "",
    licenseNumber: "",
    },
    onSubmit: async () => {},
  });
  return (
    <div className="p-4">
      {list.map((item) => (
        <div key={item.id}>
          <RegistrationUploadDocumentCard {...item} />
        </div>
      ))}
    </div>
  );
}
