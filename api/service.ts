import { fetchService } from "@/boot/fetch-service";

export async function sendServiceData(data: any, id: number) {
  try {
    const result = await fetchService(`contract-chadco-customer/service/${id}`, {
      method: "PATCH",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
