import { fetchService } from "@/boot/fetch-service";

export async function addPackage(data: any) {
  try {
    const result = await fetchService("package", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePackage(id: number) {
  try {
    const result = await fetchService(`package/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function editPackage(id: number,data:any) {
  try {
    const result = await fetchService(`package/${id}`, {
      method: "PUT",
      body:data
    });

    return result;
  } catch {}
}
export async function getPackage() {
  try {
    const result = await fetchService("package");

    return result;
  } catch {}
}
