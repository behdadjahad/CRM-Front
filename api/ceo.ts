import { fetchService } from "@/boot/fetch-service";

export async function addCeoDetail(data: any) {
  try {
    const result = await fetchService("ceodetails", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function addCeoCommunication(data: any) {

  try {
    const result = await fetchService("communication/many/ceo", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function addCompanyInfo(data: any) {
  try {
    const result = await fetchService("communication/many/ceo", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}