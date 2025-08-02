import RegistrationUploadDocumentCard from "./registration-upload-document-card";
import { Button } from "../ui/button";
import { useState } from "react";

export interface RegistrationUploadDocumentInterface {
  list: {
    id: number;
    title: string;
    required: boolean;
  }[];
  onSubmitDocumnets: (documnets: any[]) => void;
}

export default function RegistrationUploadDocumentContainer({
  list,
  onSubmitDocumnets,
}: RegistrationUploadDocumentInterface) {
  const [documents, setDocuments] = useState<any[]>([]);
  const handleDocumentChange = (updatedDoc: any) => {
    setDocuments((prevDocs) => {
      const existingIndex = prevDocs.findIndex(
        (doc) => doc.id === updatedDoc.id
      );
      if (existingIndex > -1) {
        const updatedDocs = [...prevDocs];
        updatedDocs[existingIndex] = updatedDoc;
        return updatedDocs;
      }
      return [...prevDocs, updatedDoc];
    });
  };
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="p-2">مدارک شرکت</h2>
      <div className="flex flex-col gap-4">
        {list.map((item) => (
          <div key={item.id}>
            <RegistrationUploadDocumentCard {...item} onChange={(doc) => {handleDocumentChange(doc)}} />
          </div>
        ))}
      </div>
      <Button
        variant={"info"}
        className="flex justify-start w-fit"
        onClick={() => {
          onSubmitDocumnets(documents);
        }}
      >
        ثبت و تایید نهایی
      </Button>
    </div>
  );
}
