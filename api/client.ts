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

export async function getPerson() {
  try {
    const result = await fetchService("person");

    return result;
  } catch {
    return {};
  }
}
