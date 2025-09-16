import { fetchService } from "@/boot/fetch-service";


export async function getPackages() {
  try {
    const result = await fetchService(`/packages`, {
      method: "GET",
    
    });

    return result;
  } catch {
    return {};
  }
}


export async function getPackageCategories() {
  try {
    const result = await fetchService(`/packages/categories`, {
      method: "GET",
    
    });

    return result;
  } catch {
    return {};
  }
}

export async function getPackageUnits() {
  try {
    const result = await fetchService(`/packages/units`, {
      method: "GET",
    
    });

    return result;
  } catch {
    return {};
  }
}


export async function selectPackage(packageId:number,chadcoCustomerId:number) {
  try {
    const result = await fetchService(`packages/select/${chadcoCustomerId}`, {
      method: "POST",
      body: packageId,
    });

    return result;
  } catch {}
}
