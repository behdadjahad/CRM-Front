import { fetchService } from "@/boot/fetch-service";
import { fetchService as fetchServiceChadcoCustomer } from "@/boot/chadco-customer-service";
//invoices for chadco customer
export async function getUserInvoices(chadcoCustomerId: number) {
  try {
    const result = await fetchService(`invoice/${invoiceId}/accept`, {
      method: "PATCH",
    });

    return result;
  } catch { }
}
export async function rejectInvoice(invoiceId: number) {
  try {
    const result = await fetchService(`invoice/${invoiceId}/reject`, {
      method: "PATCH",
    });

    return result;
  } catch {}
}
export async function discountInvoice(invoiceId: number,data:any) {
  try {
    const result = await fetchService(`invoice/${invoiceId}/discount`, {
      method: "PATCH",
      body:data
    });

    return result;
  } catch { }
}

//invoice details
export async function getSingleInvoice(id: number) {
  try {
    const result = await fetchServiceChadcoCustomer(`invoice/${id}`);

    return result;
  } catch { }
}

//pay invoice
export async function payInvoice(invoiceId: number, chadcoCustomerId: number) {
  try {
    const result = await fetchServiceChadcoCustomer(`payment/pay/${invoiceId}?chadcoCustomerId=${chadcoCustomerId}`, {
      method: "PATCH",

    });

    return result;
  } catch (error) {
    console.error('Error paying invoice:', error);
    throw error;
  }
}