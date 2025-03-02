import { fetchService } from "@/boot/fetch-service";

export async function getSubmittedVisas(id: number) {
  try {
    const result = await fetchService(`visa-contract/${id}`);

    return result;
  } catch {}
}
export async function sendVisaData(data: any, id: number) {
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

    const result = await fetchService(`visa-contract/${id}`, {
      method: "POST",
      body: formData,
    });

    return result;
  } catch {}
}
export async function editVisaData(data: any, id: number) {
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

    const result = await fetchService(`visa-contract/${id}`, {
      method: "PUT",
      body: formData,
    });

    return result;
  } catch {}
}
export async function deleteVisaData(id: number) {
  try {
    const result = await fetchService(`visa-contract/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {}
}
export async function getCountries() {
    try {
      const result = await fetchService("country");

      return result;
    } catch {}
  }
export async function getVisaTypes() {
    try {
      const result = await fetchService("visa-type");

      return result;
    } catch {}
  }
export async function getVisaDurationTypes() {
    try {
      const result = await fetchService("visa-duration-type");

      return result;
    } catch {}
  }
export async function getVisaEntranceTypes() {
    try {
      const result = await fetchService("visa-entrance-type");

      return result;
    } catch {}
  }