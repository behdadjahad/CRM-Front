import { fetchService } from "@/boot/fetch-service";

export async function getTransportationTypeId(type:string) {
  try {
    const result = await fetchService(`transportation-type/name?${type}`);

    return result;
  } catch {
    return {};
  }
}
