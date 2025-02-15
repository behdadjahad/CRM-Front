import { fetchService } from "@/boot/fetch-service";

export async function getCurrencies() {
  try {
    const result = await fetchService("currency");

    return result;
  } catch {
    return {};
  }
}