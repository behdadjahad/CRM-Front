import { fetchService } from "@/boot/fetch-service";

export async function getReportData(data: any) {
  try {
    const result = await fetchService(
      data.startDate && data.endDate
        ? `reports?beginRangeDateTime=${data.startDate}&endRangeDateTime=${data.endDate}`
        : 'reports'
    );

    return result;
  } catch {
    return {};
  }
}
