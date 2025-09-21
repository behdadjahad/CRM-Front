import { fetchService } from "@/boot/chadco-customer-service";

export async function acceptInvoice(invoiceId: number) {
  try {
    const result = await fetchService(`invoice/${invoiceId}/accept`, {
      method: "PATCH",
    });

    return result;
  } catch {}
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
  } catch {}
}
