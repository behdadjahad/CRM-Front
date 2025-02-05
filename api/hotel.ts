import { fetchService } from "@/boot/fetch-service";

export async function getHotels() {

  try {
    const result = await fetchService('accommodation');

    return result;
  } catch {
    return {};
  }
}
export async function getServiceTypes() {

  try {
    const result = await fetchService('service-type');

    return result;
  } catch {
    return {};
  }
}