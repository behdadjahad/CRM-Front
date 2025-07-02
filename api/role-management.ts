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
export async function editPackage(id: number, data: any) {
  try {
    const result = await fetchService(`package/${id}`, {
      method: "PUT",
      body: data,
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
export async function addPackageCategory(data: any) {
  try {
    const result = await fetchService("package-category", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editPackageCategory(id: number, data: any) {
  try {
    const result = await fetchService(`package-category/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePackageCategory(id: number) {
  try {
    const result = await fetchService(`package-category/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getPackageCategory() {
  try {
    const result = await fetchService("package-category");

    return result;
  } catch {}
}
export async function addPackageUnit(data: any) {
  try {
    const result = await fetchService("package-unit", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editPackageUnit(id: number, data: any) {
  try {
    const result = await fetchService(`package-unit/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePackageUnit(id: number) {
  try {
    const result = await fetchService(`package-unit/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getPackageUnit() {
  try {
    const result = await fetchService("package-unit");

    return result;
  } catch {}
}