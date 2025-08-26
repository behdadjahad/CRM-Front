import { fetchService } from "@/boot/fetch-service";

export async function getCalendarData(data?: any) {
  const query = data ? `calender?startDateRange=${data.startDateRange}&endDateRange=${data.endDateRange}`:"calender";
  try {
    const result = await fetchService(query);

    return result;
  } catch {}
}