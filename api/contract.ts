import { fetchService } from "@/boot/fetch-service";

export async function getContractTypes(): Promise<ServiceOutput> {
  try {
    const result: ServiceOutput = await fetchService("contract-type");
    console.log(result)
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
): Promise<any> {
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
): Promise<any> {
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
  destinationCityId:number;
  destinationCountryId:number;
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

export async function getContracts({ data }: { data?: any}): Promise<ContractInformationOutput> {
  try {
    const result: ContractInformationOutput = await fetchService(
      "contract-chadco-customer/filter-contracts", {
        method: "POST",
        body:data ? data : {}
      }
    );

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

export async function getContractById(id: number): Promise<any > {

  try {
    const result = await fetchService(
      `contract-chadco-customer/${id}`
    );

    return result;
  } catch { }
}

export interface ContractOutput {
  id: number;
  submitDateTime: string;
  userResponsibleId: number;
  contractNo: string;
  avServices: any;
  state: string;
  destinationCity: {id:number,name:string};
  destinationCountry: {id:number,name:string};
  userResponsible: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
  };
  dateType: string;
  userSubmitter: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
  };
  contractDate: string;
  contractType: {
    id: number;
    name: string;
  };
  contractCurrency: string;
  chadcoCustomerId: number;
  description: string;
  contractPayments: any;
  returnDate: string;
  mainCustomerSoldto: any;
  totalBenefit: string;
  contractFile: string;
  isItFinalized: boolean;
  contractStatus: string;
}
