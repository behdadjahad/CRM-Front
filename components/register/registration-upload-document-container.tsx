import RegistrationUploadDocumentCard from "./registration-upload-document-card";
import { Button } from "../ui/button";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { submitRegistration } from "@/api/signup";
import { useRouter } from "next/navigation";

export interface RegistrationUploadDocumentInterface {
  list: {
    id: number;
    title: string;
    required: boolean;
  }[];
  uploadedDocuments: {
    id: number;
    documentTypeId: number;
    licenceNumber: string;
    licenseFile: string;
    title: string;
  }[];
}

export default function RegistrationUploadDocumentContainer({
  list,
  uploadedDocuments,
}: RegistrationUploadDocumentInterface) {
   const router = useRouter();
  const userData = useSelector((state: RootState) => state.user);
  const { mutate: submitHandler } = useMutation({
    mutationFn: () => {
      return submitRegistration(userData.registerationRequestId);
    },
    onSuccess: (result) => {
      if (result) {
        router.push("/pending-register");
      }
    },
  });
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="p-2">مدارک شرکت</h2>
      <div className="flex flex-col gap-4">
        {list.map((item) => (
          <div key={item.id}>
            <RegistrationUploadDocumentCard
              {...item}
              data={uploadedDocuments.find(
                (doc) => doc.documentTypeId === item.id
              )}
            />
          </div>
        ))}
      </div>
      <Button
        variant={"info"}
        className="flex justify-start w-fit"
        onClick={() => {
          submitHandler();
        }}
      >
        ثبت و تایید نهایی
      </Button>
    </div>
  );
}
