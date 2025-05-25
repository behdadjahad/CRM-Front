import { fetchService } from "@/boot/fetch-service";

export async function getReportData(data: any) {
  try {
    const result = await fetchService("reports", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
