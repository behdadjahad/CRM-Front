import {
  deleteAirline,
  editAirline,
  submitAirline,
} from "@/api/setting-airline";
import {
  deleteAirport,
  editAirport,
  submitAirport,
} from "@/api/setting-airport";
import { deleteHotel, editHotel, submitHotel } from "@/api/setting-hotel";
import { fetchAirlines, fetchAllAirlines, setAirlineCheckedItems } from "@/store/airline-slice";
import { fetchAllHotels, fetchHotels, setHotelCheckedItems } from "@/store/hotel-slice";
import { fetchAllStations, fetchStations, setStationCheckedItems } from "@/store/station-slice";

const titles = {
  airport: "فرودگاه",
  hotel: "هتل",
  airline: "ایرلاین",
};
export const getFieldFromLabel = (label: string): string | undefined => {
  const labelToFieldMap: Record<string, string> = {
    کشور: "country.name",
    شهر: "city.name",
    ایرلاین: "name",
    "تاریخ ثبت": "submitDateTime",
    "ثبت کننده": "userSubmitter.lastName",
    هتل: "name",
    فرودگاه: "name",

    // Add more mappings as needed
  };

  return labelToFieldMap[label];
};

export function getTitleFromSlug(slug: any) {
  return titles[slug as keyof typeof titles] || "";
}
export const sliceMap = {
  airport: {
    selector: (state: any) => state.station,
    fetchAction: fetchStations,
    fetchAllData: fetchAllStations,
    setCheckedItems: setStationCheckedItems
  },
  hotel: {
    selector: (state: any) => state.hotel,
    fetchAction: fetchHotels,
    fetchAllData: fetchAllHotels,
    setCheckedItems: setHotelCheckedItems
  },
  airline: {
    selector: (state: any) => state.airline,
    fetchAction: fetchAirlines,
    fetchAllData: fetchAllAirlines,
    setCheckedItems: setAirlineCheckedItems
  },
};
export function createSettingFormFields(
  service: any,
  countries?: any[],
  cities?: any[],
  airports?: any[],
  accommodationTypes?: any[],
  hotels?: any[],
  airlines?: any[],
  disabled?: boolean
) {
  switch (service) {
    case "airport":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,
          disabled: disabled,
        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,
          disabled: disabled,
        },
        {
          key: "airport",
          component: "SuggestionInput",
          placeholder: "فرودگاه",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: airports,
          disabled: disabled,
        },
      ];
    case "hotel":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,
          disabled: disabled,
        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,
          disabled: disabled,
        },
        {
          key: "accommadationType",
          component: "Select",
          placeholder: "نوع اقامت گاه",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: accommodationTypes,
          disabled: disabled,
        },
        {
          key: "hotel",
          component: "SuggestionInput",
          placeholder: "هتل",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: hotels,
          disabled: disabled,
        },
      ];
    case "airline":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,
          disabled: disabled,
        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,
          disabled: disabled,
        },

        {
          key: "airline",
          component: "SuggestionInput",
          placeholder: "ایرلاین",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: airlines,
          disabled: disabled,
        },
      ];
    default:
      return [];
  }
}
export function createSettingEditFormFields(
  service: any,
  countries?: any[],
  cities?: any[],
  airports?: any[],
  accommodationTypes?: any[],
  hotels?: any[],
  airlines?: any[],

) {
  switch (service) {
    case "airport":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,

        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,

        },
        {
          key: "airport",
          component: "SuggestionInput",
          placeholder: "فرودگاه",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: airports,

        },
      ];
    case "hotel":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,

        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,

        },
        {
          key: "accommadationType",
          component: "Select",
          placeholder: "نوع اقامت گاه",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: accommodationTypes,

        },
        {
          key: "hotel",
          component: "SuggestionInput",
          placeholder: "هتل",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: hotels,

        },
      ];
    case "airline":
      return [
        {
          key: "country",
          component: "Select",
          placeholder: "کشور",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: countries,

        },
        {
          key: "city",
          component: "Select",
          placeholder: "شهر",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: cities,

        },

        {
          key: "airline",
          component: "SuggestionInput",
          placeholder: "ایرلاین",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: airlines,

        },
      ];
    default:
      return [];
  }
}
export function createSettingFormValues(service: any) {
  switch (service) {
    case "airport":
      return {
        country: "",
        city: "",
        airport: "",
      };
    case "hotel":
      return {
        country: "",
        city: "",
        accommadationType: "",
        hotel: "",
      };
    case "airline":
      return {
        country: "",
        city: "",
        airline: "",
      };
    default:
      return {};
  }
}
export function createSettingHeaderLabels(service: any) {
  switch (service) {
    case "airport":
      return ["ردیف", "کشور", "شهر", "فرودگاه", "تاریخ ثبت", "ثبت کننده"];
    case "hotel":
      return [
        "ردیف",
        "کشور",
        "شهر",
        "نوع هتل",
        "هتل",
        "تاریخ ثبت",
        "ثبت کننده",
      ];
    case "airline":
      return ["ردیف", "کشور", "شهر", "ایرلاین", "تاریخ ثبت", "ثبت کننده"];
    default:
      return [];
  }
}

export function createSettingSubmitData(service: any, formik: any) {
  switch (service) {
    case "airport":
      return {
        name: formik.values.airport,
        transportationTypeId: 301,
        countryId: formik.values.country,
        cityId: formik.values.city,
      };

    case "hotel":
      return {
        name: formik.values.hotel,
        countryId: formik.values.country,
        cityId: formik.values.city,
        accommodationTypeId: formik.values.accommadationType,
      };
    case "airline":
      return {
        name: formik.values.airline,
        countryId: formik.values.country,
        cityId: formik.values.city,
      };
    default:
      return {};
  }
}
export function getSettingSubmit(service: any, data: any) {
  switch (service) {
    case "airport":
      return submitAirport(data);
    case "hotel":
      return submitHotel(data);
    case "airline":
      return submitAirline(data);
    default:
      return submitHotel(data);
  }
}
export function getSettingDelete(service: any, item: number) {
  switch (service) {
    case "airport":
      return deleteAirport(item);
    case "hotel":
      return deleteHotel(item);
    case "airline":
      return deleteAirline(item);
    default:
      return deleteHotel(item);
  }
}
export function getSettingEdit(service: any, item: number, data: any) {
  switch (service) {
    case "airport":
      return editAirport(item, data);
    case "hotel":
      return editHotel(item, data);
    case "airline":
      return editAirline(item, data);
    default:
      return editHotel(item, data);
  }
}
