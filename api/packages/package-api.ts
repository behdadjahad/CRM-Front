import { fetchService as fetchServiceChadcoCustomer } from "@/boot/chadco-customer-service";
import { fetchService as fetchServiceFetchService } from "@/boot/fetch-service";


export async function getPackages() {
  try {
    const result = await fetchServiceFetchService(`package/package-list`, {
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
    const result = await fetchServiceFetchService(`packages/categories`, {
      method: "GET",
    });

    return result;
  } catch {
    return {};
  }
}

export async function getPackageUnits() {
  try {
    const result = await fetchServiceFetchService(`packages/units`, {
      method: "GET",
    });

    return result;
  } catch {
    return {};
  }
}


export async function selectPackage({
  packageId,
  requestMessage,
  chadcoCustomerId,

}: {
  packageId: number;
  requestMessage: string;
  chadcoCustomerId: number;

}) {
  try {
    console.log('🔍 API: Starting selectPackage call', {
      packageId,
      requestMessage,
      chadcoCustomerId,
      endpoint: `packages/buy/${chadcoCustomerId}`
    });

    const result = await fetchServiceChadcoCustomer(`packages/buy/${chadcoCustomerId}`, {
      method: "POST",
      body: {
        packageId,
        requestMessage,
      },
    });

    console.log('✅ API: selectPackage succeeded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error selecting package:', error);
    throw error;
  }
}

// Get packages by invoice ID
export async function getPackagesByInvoice(invoiceId: number) {
  try {
    console.log('🔍 API: Starting getPackagesByInvoice call', {
      invoiceId,
      endpoint: `packages/by-invoice/${invoiceId}`
    });

    const result = await fetchServiceChadcoCustomer(`packages/by-invoice/${invoiceId}`, {
      method: "GET",
    });


    return result;
  } catch (error) {

    throw error;
  }
}