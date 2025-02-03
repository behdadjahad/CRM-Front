import { fetchService } from "@/boot/fetch-service";

export async function getCountries(): Promise<CountryOutput> {
  try {
    const result: CountryOutput = await fetchService("country");
    return result;
  } catch {
    return CountryOutputStatic;
  }
}

export interface CountryOutput {
  success: boolean;
  data: {
    id: number;
    name: string;
  }[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

const CountryOutputStatic = {
  success: false,
  data: [],
  pagination: {
    limit: 0,
    offset: 0,
    total: 0,
  },
};

export async function getCities(): Promise<CityOutput> {
  try {
    const result: CityOutput = await fetchService("city");
    return result;
  } catch {
    return CityOutputStatic;
  }
}

export interface CityOutput {
  success: boolean;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
  accessToken: string;
  data: {
    id: number;
    name: string;
    countryId: number;
    provinceId: number;
    timezone: string;
    belongsToOrganization: boolean;
  }[];
}

const CityOutputStatic = {
  success: false,
  pagination: {
    total: 0,
    limit: 0,
    offset: 0,
  },
  accessToken: "",
  data: [
    {
      id: 0,
      name: "",
      countryId: 0,
      provinceId: 0,
      timezone: "",
      belongsToOrganization: false,
    },
  ],
};

export async function getProvinces(){
  try {
    const result = await fetchService('province');

    return result;
  } catch {
    return ;
  }
}