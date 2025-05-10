import { fetchService } from "@/boot/fetch-service";

export async function sendStopData(data: any, id: number) {
  try {
    const result = await fetchService(`flight-stops/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editStopData(data: any, id: number) {
  try {
    const result = await fetchService(`flight-stops/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteStopData(id: number) {
  try {
    const result = await fetchService(`flight-stops/${id}`, {
      method: "DELETE",

    });

    return result;
  } catch {}
}
