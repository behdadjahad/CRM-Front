import { fetchService } from "@/boot/fetch-service";

export async function addLead(data: any) {
  try {
    const result = await fetchService("lead", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteLead(leadId: any) {
  try {
    const result = await fetchService(`lead/${leadId}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}