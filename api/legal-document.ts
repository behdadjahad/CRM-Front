import { fetchService } from "@/boot/fetch-service";

export async function getLegalDocumentTypes() {
  try {
    const result = await fetchService('legal-document-type');

    return result;
  } catch {
    return {};
  }
}
