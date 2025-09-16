import { fetchService } from "@/boot/fetch-service";

export async function sendOtherData(data: any, id: number) {
  try {
    if (!data || Object.keys(data).length === 0) {
   
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

    const result = await fetchService(`other-contract/${id}`, {
      method: "POST",
      body: formData,
    });

    return result;
  } catch {}
}
export async function editOtherData(data: any, id: number) {
    try {
      if (!data || Object.keys(data).length === 0) {
        
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
  
      const result = await fetchService(`other-contract/${id}`, {
        method: "PUT",
        body: formData,
      });
  
      return result;
    } catch {}
  }
export async function getSubmittedOthers(id: number) {
    try {
      const result = await fetchService(`other-contract/${id}`);
  
      return result;
    } catch {}
  }
  export async function deleteOtherData(id: number) {
    try {
      const result = await fetchService(`other-contract/${id}`, {
        method: "DELETE",
      });
  
      return result;
    } catch {}
  }