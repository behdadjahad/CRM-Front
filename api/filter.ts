import { fetchService } from "@/boot/fetch-service";

export async function sortContracts(sortString: string) {
  try {
    const result = await fetchService(
      `contract-chadco-customer?sortBy=${sortString}`
    );

    return result;
  } catch {}
}
