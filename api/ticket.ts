import { fetchService } from "@/boot/fetch-service";

export async function getAirports() {
  try {
    const result = await fetchService('station');
    
    return result;
  } catch {
    return {};
  }
}
export async function getAirportTerminal(id:number) {
  try {
    const result = await fetchService(`terminal/${id}`);
    
    return result;
  } catch {
    return {};
  }
}
export async function getTicketData(id:number) {
  try {
    const result = await fetchService(`flight-group/${id}`);

    return result;
  } catch {
    return {};
  }
}