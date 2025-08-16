import { fetchService } from "@/boot/fetch-service";

export async function getCalendarEvents() {
  try {
    const result = await fetchService("calendar");

    return result;
  } catch {}
}