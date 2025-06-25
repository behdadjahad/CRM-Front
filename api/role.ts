import { fetchService } from "@/boot/fetch-service";

export async function getRoleData() {
  try {
    const result = await fetchService('user/access');

    return result;
  } catch {
    return {};
  }
}
