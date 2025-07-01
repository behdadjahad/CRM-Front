import { fetchService } from "@/boot/fetch-service";

export async function readNotification(id: number) {
  try {
    const result = await fetchService(`notification/read/${id}`, {
      method: "PATCH",
    });

    return result;
  } catch {
    return {};
  }
}
export async function readAllNotification() {
  try {
    const result = await fetchService('notification/read-all', {
      method: "PATCH",
    });

    return result;
  } catch {
    return {};
  }
}
