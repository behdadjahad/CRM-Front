import { fetchService } from "@/boot/fetch-service";

export async function getLaedfollowUpTypes() {
  try {
    const result = await fetchService("lead-follow-up-type");

    return result;
  } catch {}
}