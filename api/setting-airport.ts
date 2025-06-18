import { fetchService } from "@/boot/fetch-service";

export async function submitAirport(data: any) {
  try {
    const result = await fetchService('station/301', {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteAirport(id: number) {
  try {
    const result = await fetchService(`station/${id}`, {
      method: "DELETE",
    
    });

    return result;
  } catch {}
}
export async function editAirport(id: number,data:any) {
  try {
    const result = await fetchService(`station/${id}`, {
      method: "PUT",
      body:data
    });

    return result;
  } catch {}
}