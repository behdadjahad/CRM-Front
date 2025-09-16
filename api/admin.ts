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
    const result = await fetchService("package?limit=50");

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
    const result = await fetchService("package-category?limit=50");

    return result;
  } catch {}
}

export async function addCategorytoPackage(id: number, items: any) {
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
export async function removePackageUnitFromCategory(
  categoryId: number,
  data: any
) {
  try {
    const result = await fetchService(
      `package-unit/remove-from-category/${categoryId}`,
      {
        method: "POST",
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
    const result = await fetchService("package-unit?limit=50");

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
export async function getPackageUnitCostsOfPackageUnit(packageunitId: number) {
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
    const result = await fetchService("page?limit=50");

    return result;
  } catch {}
}
export async function getSinglePageFeature(pageId: number) {
  try {
    const result = await fetchService(`page-feature/page/${pageId}?limit=50`);

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
export async function addRole(data: any) {
  try {
    const result = await fetchService("role", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editRole(id: number, data: any) {
  try {
    const result = await fetchService(`role/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteRole(id: number) {
  try {
    const result = await fetchService(`role/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getRole() {
  try {
    const result = await fetchService("role");

    return result;
  } catch {}
}
export async function addPermission(data: any) {
  try {
    const result = await fetchService("permission", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function addPermissionToRole(roleId: number, data: any) {
  try {
    const result = await fetchService(`permission/add-to-role/${roleId}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePermissionFromRole(roleId: number, data: any) {
  try {
    const result = await fetchService(`permission/remove-from-role/${roleId}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function addPermissionToPackageUnit(
  packageUnitId: number,
  data: any
) {
  try {
    const result = await fetchService(
      `permission/add-to-unit/${packageUnitId}`,
      {
        method: "POST",
        body: data,
      }
    );

    return result;
  } catch {}
}
export async function deletePermissionFromPackageUnit(
  packageUnitId: number,
  data: any
) {
  try {
    const result = await fetchService(
      `permission/remove-from-unit/${packageUnitId}`,
      {
        method: "POST",
        body: data,
      }
    );

    return result;
  } catch {}
}
export async function editPermission(id: number, data: any) {
  try {
    const result = await fetchService(`permission/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deletePermission(id: number) {
  try {
    const result = await fetchService(`permission/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getPermission() {
  try {
    const result = await fetchService("permission");

    return result;
  } catch {}
}
export async function getLabel() {
  try {
    const result = await fetchService("package-unit-label");

    return result;
  } catch {}
}
export async function addLabel(data: any) {
  try {
    const result = await fetchService("package-unit-label", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editLabel(id: number, data: any) {
  try {
    const result = await fetchService(`package-unit-label/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteLabel(id: number) {
  try {
    const result = await fetchService(`package-unit-label/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}

export async function addPackageUnitToLabel(labelId: number, data: any) {
  try {
    const result = await fetchService(`package-unit-label/add-package-units/${labelId}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
