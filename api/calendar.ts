import { fetchService } from "@/boot/fetch-service";

export async function getCalendarData() {
  try {
    const result = await fetchService("calender");

    return result;
  } catch {}
}