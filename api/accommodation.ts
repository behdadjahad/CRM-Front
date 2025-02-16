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
          formData.append("files", fileObj.file);
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
export async function editHotelData(data: any, id: number) {
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

    const result = await fetchService(`accommodation-contract/${id}`, {
      method: "PUT",
      body: formData,
    });

    return result;
  } catch {}
}
export async function deleteHotelData(id: number) {
  try {
    const result = await fetchService(`accommodation-contract/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getAccommodationTypes() {
  try {
    const result = await fetchService("accommodation-type");

    return result;
  } catch {
    return {};
  }
}
export async function sendRoomData(data: any, id: number) {
  try {
    const result = await fetchService(`accommodation-contract-room/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}


export async function editRoomData(data: any, id: number) {
  try {
    const result = await fetchService(`accommodation-contract-room/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteRoomData(id: number) {
  try {
    const result = await fetchService(`accommodation-contract-room/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch { }
}
export async function getRooms() {
  try {
    const result = await fetchService("room-type");

    return result;
  } catch {
    return {};
  }
}
export async function getSubmittedHotels(id: number) {
  try {
    const result = await fetchService(`accommodation-contract/${id}`);

    return result;
  } catch {}
}
export async function getSubmittedRooms(id: number) {
  try {
    const result = await fetchService(`accommodation-contract-room/${id}`);

    return result;
  } catch {}
}
