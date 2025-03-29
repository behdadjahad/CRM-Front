import { fetchService } from "@/boot/fetch-service";

/*Get All Customers*/
export async function getAllCustomers() {
  try {
    const result = await fetchService("customer/filter");

    return result;
  } catch {
    return {};
  }
}

export async function getCustomers(id: number) {
  try {
    const result = await fetchService(`contract-customers/${id}`);

    return result;
  } catch {
    return {};
  }
}
export async function addCustomerData(data: any, id: number) {
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
export async function deleteCustomerData(id: number) {
  try {
    const result = await fetchService(`contract-customers/${id}`, {
      method: "DELETE",
    });

    return result;
  } catch {
    return {};
  }
}
export async function editCustomerData(id: number,data:any) {
  try {
    const result = await fetchService(`contract-customers/${id}`, {
      method: "PUT",
      body: data
    });

    return result;
  } catch {
    return {};
  }
}

export async function addMultipleCustomerData(data: any, id: number) {
  try {
    const result = await fetchService(`contract-customers/multiple-customers/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}