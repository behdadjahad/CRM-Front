import { fetchService } from "@/boot/fetch-service";

/*Get All Customers*/
export async function getAllCustomers({page,limit}:{page?:number,limit:number}) {
  try {
    const result = await fetchService(`customer/filter?page=${page}&limit=${limit}`);

    return result;
  } catch {
    return {};
  }
}

export async function getCustomersData(id: number) {
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
export async function editCustomerData(id: number, data: any) {
  try {
    const result = await fetchService(`contract-customers/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {
    return {};
  }
}

export async function addMultipleCustomerData(data: any, id: number) {
  try {
    const result = await fetchService(
      `contract-customers/multiple-customers/${id}`,
      {
        method: "POST",
        body: data,
      }
    );

    return result;
  } catch {
    return {};
  }
}
export async function getCustomers(page:number , limit:number, body?:any) {
  try {
    const result = await fetchService(`customer/rank?page=${page}&limit=${limit}`, {
      method: "POST",
      body: body ? body : {},
    });

    return result;
  } catch {
    return {};
  }
}

export async function getCustomerPersonalInfo(id: number) {
  try {
    const result = await fetchService(`customer/personal-info/${id}`);

    return result;
  } catch {
    return {};
  }
}
