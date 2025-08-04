import { fetchService } from "@/boot/fetch-service";
import { buildFormData } from "./legal-document";
export interface SignUpInput {
  registerationRequest: {
    companyName: string;
    // brandName:  string;
    // registerationNumber:  string;
    // nationalId:  string;
    // economicCode:  string;
    // companyType:  string;
    // address:  string;
    // postalCode:  string;
    // phoneNumber:  string;
    // email:  string;
    // website:  string;
    // description:  string;
    // logoFile:  string;
    // establishedDate: string;
    // status:  string;
    // cityId: number;
    // provinceId:number;
    // countryId: number;
  };
  user: {
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    // middleName: string;
    cityId: number;
    // userName: string;
    // password: string;
    // gender: string;
    // birthdate: string;
    // idNumber: string;
  };
}

export async function SignUp(data: SignUpInput): Promise<any> {
  try {
    const result: any = await fetchService("registeration-request", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return;
  }
}
export async function updateRegistrationData(id: number, data: any) {
  try {
    // const formData = new FormData();

    // for (const key in data) {
    //   if (key !== "files") {
    //     formData.append(key, data[key]);
    //   }
    // }

    // if (Array.isArray(data.files)) {
    //   data.files.forEach((fileObj: any) => {
    //     if (fileObj?.file instanceof File) {
    //       formData.append("files", fileObj.file);
    //     }
    //   });
    // }
    const formData = buildFormData(data, "logo");
    const result: any = await fetchService(`registeration-request/${id}`, {
      method: "PUT",
      body: formData,
    });

    return result;
  } catch {
    return;
  }
}
export async function getRegistrationData(registerationRequestId: number) {
  try {
    const result = await fetchService(
      `registeration-request/${registerationRequestId}`
    );

    return result;
  } catch {
    return;
  }
}
export async function submitRegistration(registerationRequestId: number) {
  try {
    const result = await fetchService(
      `registeration-request/pending/${registerationRequestId}`, {
        method:"PATCH"
      }
    );

    return result;
  } catch {
    return;
  }
}
