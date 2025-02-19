import { fetchService } from "@/boot/fetch-service";

export async function getCurrencies() {
  try {
    const result = await fetchService("currency");

    return result;
  } catch {
    return {};
  }
}


export async function sendExchageRate(data:any,id:number) {
  try {
    const result = await fetchService(`contract-chadco-customer/currency/${id}`, {
      method: "PATCH",
      body: data,
    });

    return result;
  } catch {}
}
export async function getAllExpenses(id:number) {
  try {
    const result = await fetchService(`contract-chadco-customer/prices/${id}`);

    return result;
  } catch {
    return {};
  }
}
export async function sendSingleExchageRate(data:any,id:number) {
  try {
    const result = await fetchService(`contract-chadco-customer/exchange-rate/${id}`, {
      method: "PATCH",
      body: data,
    });

    return result;
  } catch {}
}
export async function addIncomeData(data:any,id:number) {
  try {

    const result = await fetchService(`contract-incomes/many/${id}`, {
      method: "POST",
      body: data,
    });

    return result;
  } catch {}
}
export async function editIncomeData(data:any,id:number) {
  try {
    const result = await fetchService(`contract-incomes/${id}`, {
      method: "PUT",
      body: data,
    });

    return result;
  } catch {}
}
export async function deleteIncomeData(id:number) {
  try {
    const result = await fetchService(`contract-incomes/${id}`, {
      method: "DELETE",
 
    });

    return result;
  } catch {}
}
export async function getSubmittedIncome(id:number) {
  try {
    const result = await fetchService(`contract-incomes/${id}`);
    return result;
  } catch {
    return {};
  }
}
