export function createSettingFormFields(
  service: any,
  countries?: any[],
  cities?: any[],
  airports?: any[]
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
          key: "hotel",
          component: "SuggestionInput",
          placeholder: "هتل",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: [],
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
  airports?: any[]
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
          key: "hotel",
          component: "SuggestionInput",
          placeholder: "هتل",
          type: "text",
          floating: true,
          className: "w-full md:w-1/4",
          options: [],
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
        hotel: "",
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
      return ["ردیف", "کشور", "شهر", "هتل", "تاریخ ثبت", "ثبت کننده"];
    default:
      return [];
  }
}
