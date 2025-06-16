import { fetchService } from "@/boot/fetch-service";

export async function submitAirport(data: any) {
  try {
    const result = await fetchService('station', {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}