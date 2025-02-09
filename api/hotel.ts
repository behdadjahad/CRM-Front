import { fetchService } from "@/boot/fetch-service";

export async function getHotels() {
  try {
    const result = await fetchService("accommodation");

    return result;
  } catch {
    return {};
  }
}
export async function getServiceTypes() {
  try {
    const result = await fetchService("service-type");

    return result;
  } catch {
    return {};
  }
}

export async function sendHotelData(data: any, id: number) {
  try {
    if (!data || Object.keys(data).length === 0) {
      console.warn("sendHotelData: No data provided!");
      return { error: "No data to send" };
    }

    const formData = new FormData();

    for (const key in data) {
      if (key !== "files") {
        formData.append(key, data[key]);
      }
    }

    if (Array.isArray(data.files)) {
      data.files.forEach((fileObj: any) => {
        if (fileObj?.file instanceof File) {
          formData.append("files", fileObj.file); // ✅ Append with the same key
        }
      });
    }

    const result = await fetchService(`accommodation-contract/${id}`, {
      method: "POST",
      body: formData,
    });

    return result;
  } catch {}
}
