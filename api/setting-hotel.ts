import { fetchService } from "@/boot/fetch-service";

export async function submitHotel(data: any) {
  try {
    const result = await fetchService("accommodation", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteHotel(id: number) {
  try {
    const result = await fetchService(`accommodation/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function editHotel(id: number, data: any) {
  try {
    const result = await fetchService(`accommodation/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
