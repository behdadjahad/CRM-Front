import { fetchService } from "@/boot/fetch-service";

export async function getfollowUpTypes() {
  try {
    const result = await fetchService("follow-up-type");

    return result;
  } catch {}
}