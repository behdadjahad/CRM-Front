import { fetchService } from "@/boot/fetch-service";
import { buildQueryString } from "@/lib/utils";

export async function getCalendarData(data?: any) {
  const queryParams = buildQueryString({
    ...data, // spread your filters into the query params
  });
  try {
    const result = await fetchService(`calender?${queryParams}`);

    return result;
  } catch { }
}
