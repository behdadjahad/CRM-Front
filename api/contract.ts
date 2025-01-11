import { fetchService } from "@/boot/fetch-service";

export async function getServices(): Promise<ServiceOutput> {
  try {
    const result: ServiceOutput = await fetchService("contract-type");

    return result;
  } catch (ev) {
    return {
      success: false,
      data: [],
      pagination: {
        limit: 0,
        offset: 0,
        total: 0,
      },
    };
  }
}

export interface ServiceOutput {
  success: boolean;
  data: {
    id: number;
    chadcoCustomerId: number;
    name: string;
    splitter: string;
    iconFile: string;
    comment: string;
  }[];
  pagination: {
    total: number | null;
    limit: number | null;
    offset: number | null;
  };
}
//const serviceStaticOutput: ServiceOutput = {};
