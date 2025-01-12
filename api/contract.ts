import { fetchService } from "@/boot/fetch-service";

export async function getServices(): Promise<ServiceOutput> {
  try {
    const result: ServiceOutput = await fetchService("contract-type");
    return result;
  } catch {
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

export async function getContractNumber(
  id: number
): Promise<ContractTypeOutput> {
  try {
    const result: ContractTypeOutput = await fetchService(
      `contract-type/suggest/${id}`
    );

    return result;
  } catch {
    return {
      success: false,
      data: {
        suggestedContractNo: "",
        contractId: 0,
      },
    };
  }
}

export interface ContractTypeOutput {
  success: boolean;
  data: {
    suggestedContractNo: string;
    contractId: number;
  };
}

export async function createContract(
  contractId: number,
  data: ContractCreationInput
): Promise<ContractCreationOutput> {
  try {
    const result = await fetchService(
      `contract-chadco-customer/${contractId}`,
      {
        method: "PUT",
        body: data,
      }
    );

    return result;
  } catch {
    return {
      success: false,
      accessToken: "",
      data: {
        id: 0,
        chadcoCustomerId: 0,
        contractTypeId: 0,
        contractDate: "",
        returnDate: "",
        mainCustomerSoldtoId: 0,
        contractCurrencyId: 0,
        totalBenefit: 0,
        contractFile: "",
        userSubmitterId: 0,
        userResponsibleId: 0,
        submitDateTime: "",
        isItFinalized: false,
        contractStatus: "",
        avServices: [],
        dateType: "",
        description: "",
      },
    };
  }
}

export interface ContractCreationInput {
  contractTypeId: number;
  contractDate: string;
  dateType: string;
  description: string;
  userSubmitterId: number;
  userResponsibleId: number;
}

export interface ContractCreationOutput {
  success: boolean;
  accessToken: string;
  data: {
    id: number;
    chadcoCustomerId: number;
    contractTypeId: number;
    contractDate: string;
    returnDate: string;
    mainCustomerSoldtoId: number;
    contractCurrencyId: number;
    totalBenefit: number;
    contractFile: string;
    userSubmitterId: number;
    userResponsibleId: number;
    submitDateTime: string;
    isItFinalized: boolean;
    contractStatus: string;
    avServices: string[];

    dateType: string;
    description: string;
  };
}

export async function getContracts(): Promise<ContractInformationOutput> {
  try {
    const result: ContractInformationOutput = await fetchService(
      "contract-chadco-customer"
    );
    console.log(118, result);
    return result;
  } catch {
    return {
      data: [],
      pagination: {
        total: 0,
      },
      doneCount: 0,
      inProgressCount: 0,
    };
  }
}

export interface ContractInformationOutput {
  data: [];
  pagination: {
    total: number;
  };
  doneCount: number;
  inProgressCount: number;
}
