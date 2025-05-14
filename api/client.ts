import { fetchService } from "@/boot/fetch-service";

export async function createClient(data: any, id: number) {
  try {
    const result = await fetchService("person", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
export async function editClient(data: any, id: number) {
  try {
    const result = await fetchService(`person/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}

// export async function getPerson(id: number) {
//   try {
//     const result = await fetchService(`person/${id}`);

//     return result;
//   } catch {
//     return {};
//   }
// }
export async function insertAddressData(data: any) {
  try {
    const result = await fetchService("address", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
export async function editAddressData(data: any, id: number) {
  try {
    const result = await fetchService(`address/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
// export async function getAddressData(id: number) {
//   try {
//     const result = await fetchService(`address/customer/home/${id}`);

//     return result;
//   } catch {
//     return {};
//   }
// }
export async function insertCommunicationData(data: any) {
  try {
    const result = await fetchService("communication/many", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
export async function editCommunicationData(data: any) {
  try {
    const result = await fetchService('communication/many', {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
// export async function getCommunicationData(id: number) {
//   try {
//     const result = await fetchService(`communication/home/${id}`);

//     return result;
//   } catch {
//     return {};
//   }
// }
export async function createOrganization(data: any) {
  try {
    const result = await fetchService("organization", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
export async function insertSubmitterData(data: any, id: number) {
  try {
    const result = await fetchService(`contract-chadco-customer/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}
