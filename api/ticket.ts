import { fetchService } from "@/boot/fetch-service";

export async function getTicketClass(transportationTypeId:number) {
  try {
    const result = await fetchService(`ticket-class/${transportationTypeId}`);

    return result;
  } catch {
    return {};
  }
}
