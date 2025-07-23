import { fetchService } from "@/boot/fetch-service";
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
    firstName:string;
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
