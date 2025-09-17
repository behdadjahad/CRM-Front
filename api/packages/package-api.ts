import { fetchService } from "@/boot/fetch-service";


export async function getPackages() {
  try {
    const result = await fetchService(`package/package-list`, {
      method: "GET",
      additionalHeaders: {
        "Cache-Control": "no-cache"
      },
    });

    return result;
  } catch (error) {
    console.error('❌ Error fetching packages:', error);
    return {};
  }
}


export async function getPackageCategories() {
  try {
    const result = await fetchService(`packages/categories`, {
      method: "GET",

    });

    return result;
  } catch {
    return {};
  }
}

export async function getPackageUnits() {
  try {
    const result = await fetchService(`packages/units`, {
      method: "GET",

    });

    return result;
  } catch {
    return {};
  }
}


export async function selectPackage({
  packages,
  categories,
  units,
}: {
  packages?: number[];
  categories?: number[];
  units?: { unitId: number }[];
}, chadcoCustomerId: number) {
  try {
    const result = await fetchService(`packages/select/${chadcoCustomerId}`, {
      method: "POST",
      body: {
        packages,
        categories,
        units,
      },
    });

    return result;
  } catch { }
}
