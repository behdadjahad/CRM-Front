import { fetchService } from "@/boot/fetch-service";

export async function getFightClassData(id: number) {
  try {
    const result = await fetchService(`ticket-class/${id}`);

    return result;
  } catch {
    return {};
  }
}
export async function getFightTypeData(id: number) {
  try {
    const result = await fetchService(`ticket-kind/${id}`);

    return result;
  } catch {
    return {};
  }
}
export async function getAirlinesData(id: number) {
  try {
    const result = await fetchService(`transportation-co/filter/${id}`,{
      method: "POST",
      body: {},
    });

    return result;
  } catch {
    return {};
  }
}

export async function sendFlightData(data: any, id: number) {


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
          formData.append("files", fileObj.file);
        }
      });
    }

    const result = await fetchService(`flight-contract/${id}`, {
      method: "POST",
      body: formData,
    });

    return result;
  } catch {}
}

export async function editFlightData(data: any, id: number) {


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
          formData.append("files", fileObj.file);
        }
      });
    }

    const result = await fetchService(`flight-contract/${id}`, {
      method: "PUT",
      body: formData,
    });

    return result;
  } catch {}
}
export async function deleteFlightData(id: number) {
  try {
    const result = await fetchService(`flight-contract/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function deleteTicketData(id: number) {
  try {
    const result = await fetchService(`flight-group/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
