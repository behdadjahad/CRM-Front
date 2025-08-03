import { fetchService } from "@/boot/fetch-service";

export async function getLegalDocumentTypes() {
  try {
    const result = await fetchService("legal-document-type?limit=100");

    return result;
  } catch {
    return {};
  }
}
export async function getLegalDocuments(registerationRequestId:number) {
  try {
    const result = await fetchService(`legal-document-entry/${registerationRequestId}`);

    return result;
  } catch {
    return {};
  }
}
export async function uploadDocumnets(data: any) {
  console.log(data);
  try {
 
    const formData = buildFormData(data, "licenseFile");
    const result = await fetchService("legal-document-entry", {
      method: "POST",
      body: formData,
    });

    return result;
  } catch {
    return {};
  }
}
export function buildFormData(data: Record<string, any>, fileField: string): FormData {
  const formData = new FormData();

  for (const key in data) {
    if (key !== fileField) {
      formData.append(key, data[key]);
    }
  }

  const fileValue = data[fileField];

  if (Array.isArray(fileValue)) {
    fileValue.forEach((fileObj: any) => {
      if (fileObj?.file instanceof File) {
        formData.append(fileField, fileObj.file);
      }
    });
  } else if (fileValue?.file instanceof File) {
    formData.append(fileField, fileValue.file);
  }

  return formData;
}
