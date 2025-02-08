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
      console.log({ key, data });

      if (key !== "files") {
        formData.append(key, data[key]);
        console.log("here");
      }
    }

    // ✅ Append files correctly
    if (Array.isArray(data.files)) {
      data.files.forEach((fileObj: any, index: number) => {
        if (fileObj.file instanceof File) {
          formData.append(`files[${index}]`, fileObj.file); // Correctly append files
        }
      });
    }

    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    // Send FormData

    const result = await fetchService(`accommodation-contract/${id}`, {
      method: "POST",
      body: formData, // ⚠️ Do NOT set Content-Type manually!
      additionalHeaders: {
        "Content-Type": "multipart/form-data",
      },
    });

    return result;
  } catch (error) {
    console.error("Error sending hotel data:", error);
    return { error: "Failed to send data" };
  }
}
