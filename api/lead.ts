import { fetchService } from "@/boot/fetch-service";
export async function getLeadTags() {
  try {
    const result = await fetchService("lead-tag");

    return result;
  } catch {}
}
export async function addLeadTag(data:any) {
  try {
    const result = await fetchService("lead-tag", {
      method: "POST",
      body:data
    });

    return result;
  } catch {}
}

export async function getLeadTypes() {
  try {
    const result = await fetchService("lead-type");

    return result;
  } catch {}
}

export async function addLead(data: any) {
  try {
    const result = await fetchService("lead", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editLead(id:number,data: any) {
  try {
    const result = await fetchService(`lead/${id}`, {
      method: "PUT",
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
