import { fetchService } from "@/boot/fetch-service";

export async function getLegalDocumentTypes() {
  try {
    const result = await fetchService('legal-document-type?limit=100');

    return result;
  } catch {
    return {};
  }
}
export async function uploadDocumnets(registrationRequestId:number,data:any) {
  try {
    const result = await fetchService(`legal-document-entry/${registrationRequestId}`, {
      method: "POST",
      body:data
    });

    return result;
  } catch {
    return {};
  }
}
