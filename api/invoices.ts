import { fetchService } from "@/boot/fetch-service";
//invoices for chadco customer
export async function getUserInvoices(chadcoCustomerId: number) {
  try {
    const result = await fetchService(`invoice/chadco-customer/${chadcoCustomerId}`);

    return result;
  } catch {}
}

//invoices for admin
export async function getAllInvoices() {
  try {
    const result = await fetchService('invoice');

    return result;
  } catch {}
}
