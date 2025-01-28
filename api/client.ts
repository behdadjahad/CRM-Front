import { fetchService } from "@/boot/fetch-service";

export async function createClient(data: any) {
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

export async function getPerson(id: number) {
  try {
    const result = await fetchService(`person/${id}`);

    return result;
  } catch {
    return {};
  }
}

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