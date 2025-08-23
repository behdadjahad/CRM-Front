import { fetchService } from "@/boot/fetch-service";

export async function addEvent(data:any) {
  try {
    const result = await fetchService("event", {
      method: "POST",
      body:data
    });

    return result;
  } catch {}
}
