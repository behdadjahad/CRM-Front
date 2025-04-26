import { fetchService } from "@/boot/fetch-service";

export async function getCallDevices() {
  try {
    const result = await fetchService("call-device-controller");

    return result;
  } catch {
    return {};
  }
}
export async function getSatisfactionLabels() {
  try {
    const result = await fetchService("satisfaction-reason");

    return result;
  } catch {
    return {};
  }
}
export async function submitSatisfaction(data: any, id: number) {
    try {
      const result = await fetchService(`contract-satisfaction/${id}`, {
        method: "POST",
        body: data,
      });
  
      return result;
    } catch {
      return {};
    }
  }