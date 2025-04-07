import { fetchService } from "@/boot/fetch-service";

export async function getTransportationType() {
  try {
    const result = await fetchService("transportation-type");

    return result;
  } catch {
    return {};
  }
}
