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

export async function getPackageUnits(params?: {
  page?: number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}): Promise<import('@/types/single-features-api').SingleFeaturesApiResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    // Add filter parameters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          // Handle array values (for checkboxes)
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
          } else if (!Array.isArray(value)) {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `package-unit${queryParams?.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('🔍 API: Fetching package units from:', endpoint);

    const result = await fetchServiceFetchService(endpoint, {
      method: "GET",
      additionalHeaders: {
        "Cache-Control": "no-cache"
      },
    });

    console.log('✅ API: getPackageUnits succeeded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching package units:', error);
    throw error;
  }
}


export async function selectPackage({
  packageId,
  requestMessage,
  numberOfMonths,
  chadcoCustomerId,

}: {
  packageId: number;
  requestMessage: string;
  numberOfMonths: number;
  chadcoCustomerId: number;

}) {
  try {
    console.log('🔍 API: Starting selectPackage call', {
      packageId,
      requestMessage,
      numberOfMonths,
      chadcoCustomerId,
      endpoint: `packages/buy/${chadcoCustomerId}`
    });

    const result = await fetchServiceChadcoCustomer(`packages/buy/${chadcoCustomerId}`, {
      method: "POST",
      body: {
        packageId,
        numberOfMonths,
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

// Select individual unit (for single features purchase)
export async function selectUnit({
  unitId,
  requestMessage,
  chadcoCustomerId,
}: {
  unitId: number;
  requestMessage: string;
  chadcoCustomerId: number;
}) {
  try {
    console.log('🔍 API: Starting selectUnit call', {
      unitId,
      requestMessage,
      chadcoCustomerId,
      endpoint: `units/buy/${chadcoCustomerId}`
    });

    const result = await fetchServiceChadcoCustomer(`units/buy/${chadcoCustomerId}`, {
      method: "POST",
      body: {
        unitId,
        requestMessage,
      },
    });

    console.log('✅ API: selectUnit succeeded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error selecting unit:', error);
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