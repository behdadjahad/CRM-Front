import { fetchService } from "@/boot/fetch-service";

export async function getExpenses(id:number) {
  try {
    const result = await fetchService(`contract-chadco-customer/prices/${id}`);

    return result;
  } catch {
    return {};
  }
}