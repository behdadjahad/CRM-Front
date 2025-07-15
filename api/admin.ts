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

export async function addCategorytoPackage(id: number, items: any) {
  console.log(id);
  try {
    const result = await fetchService(`package-category/add-to-package/${id}`, {
      method: "POST",
      body: items,
    });

    return result;
  } catch {}
}
export async function deleteCategoryFromPackage(id: number, items: number[]) {
  const data = { ids: items };
  try {
    const result = await fetchService(
      `package-category/remove-from-package/${id}`,
      {
        method: "POST",
        body: data,
      }
    );

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
export async function addPackageUnitToCategory(categoryId: number, data: any) {
  try {
    const result = await fetchService(
      `package-unit/add-to-category/${categoryId}`,
      {
        method: "POST",
        body: data,
      }
    );

    return result;
  } catch {}
}
export async function removePackageUnitToCategory(categoryId: number, data: any) {
  try {
    const result = await fetchService(
      `package-unit/remove-from-category/${categoryId}`,
      {
        method: "DELETE",
        body: data,
      }
    );

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
export async function addPackageUnitCost(data: any) {
  try {
    const result = await fetchService("package-unit-cost", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editPackageUnitCost(id: number, data: any) {
  try {
    const result = await fetchService(`package-unit-cost/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePackageUnitCost(id: number) {
  try {
    const result = await fetchService(`package-unit-cost/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getPackageUnitCost() {
  try {
    const result = await fetchService("package-unit-cost");

    return result;
  } catch {}
}
export async function getPackageUnitCostsOfPackageUnit(packageunitId:number) {
  try {
    const result = await fetchService(`package-unit-cost/${packageunitId}`);

    return result;
  } catch {}
}

export async function addPage(data: any) {
  try {
    const result = await fetchService("page", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePage(id: number) {
  try {
    const result = await fetchService(`page/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function editPage(id: number, data: any) {
  try {
    const result = await fetchService(`page/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function getPage() {
  try {
    const result = await fetchService("page");

    return result;
  } catch {}
}
export async function addPageFeature(data: any) {
  try {
    const result = await fetchService("page-feature", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editPageFeature(id: number, data: any) {
  try {
    const result = await fetchService(`page-feature/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePageFeature(id: number) {
  try {
    const result = await fetchService(`page-feature/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
