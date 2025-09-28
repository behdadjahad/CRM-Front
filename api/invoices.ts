import { fetchService } from "@/boot/chadco-customer-service";

//invoices for chadco customer
export async function getUserInvoices(chadcoCustomerId: number) {
  try {
    const result = await fetchService(`invoice/chadco-customer/${chadcoCustomerId}`);

    return result;
  } catch {}
}

export async function acceptInvoice(invoiceId: number) {
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

export async function discountInvoice(invoiceId: number, data: any) {

  try {
      console.log(data);
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
    const result = await fetchService(`invoice/${id}`);

    return result;
  } catch { }
}

//pay invoice
export async function payInvoice(invoiceId: number, chadcoCustomerId: number) {
  try {
    const result = await fetchService(`payment/pay/${invoiceId}?chadcoCustomerId=${chadcoCustomerId}`, {
      method: "PATCH",

    });

    return result;
  } catch (error) {
    console.error('Error paying invoice:', error);
    throw error;
  }
}
export async function getAllInvoices() {
  try {
    const result = await fetchService('invoice');

    return result;
  } catch {}
}