import { fetchService } from "@/boot/fetch-service";

export async function addServiceCustomerData(data: any, id: number) {
  try {
    const result = await fetchService(`customer/add-to-service/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteServiceCustomerData(data: any, id: number) {
  try {
    const result = await fetchService(`customer/rm-from-service/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}