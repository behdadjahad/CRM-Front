import { fetchService } from "@/boot/fetch-service";

/*Get All Customers*/
export async function getAllCustomers() {
  try {
    const result = await fetchService('customer/filter');
   
    return result;
  } catch {
    return {};
  }
}

export async function getCustomers(id:number) {
  try {
    const result = await fetchService(`contract-customers/${id}`);

    return result;
  } catch {
    return {};
  }
}
export async function addCustomerData(id: number, data: any) {
  try {
    const result = await fetchService(`contract-customers/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}

