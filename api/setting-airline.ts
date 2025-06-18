import { fetchService } from "@/boot/fetch-service";

export async function submitAirline(data: any) {
  try {
    const result = await fetchService("transportation-co/301", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteAirline(id: number) {
  try {
    const result = await fetchService(`transportation-co/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function editAirline(id: number, data: any) {
  try {
    const result = await fetchService(`transportation-co/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
