import { FieldType, OptionType } from "@/components/shared/form-maker";

export function createFormFields(
  formType: string,
  cityOptions?: OptionType[],
  countryOptions?: OptionType[]
): FieldType[] {
  switch (formType) {
    case "personalFormik":
      return [
        {
          key: "name",
          component: "input",
          placeholder: "نام",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "familyName",
          component: "input",
          placeholder: "نام خانوادگی",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "birthdate",
          component: "date",
          placeholder: "تاریخ تولد",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "socialNumber",
          component: "input",
          placeholder: "کد ملی",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "idNumber",
          component: "input",
          placeholder: "شماره شناسنامه",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "career",
          component: "input",
          placeholder: "شغل",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
      ];
    case "workFormik":
      return [
        {
          key: "workProvince",
          component: "input",
          placeholder: "استان",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "workCity",
          component: "input",
          placeholder: "شهر",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "workStreet",
          component: "input",
          placeholder: "خیابان",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "workPostalCode",
          component: "input",
          placeholder: "کد پستی",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "workCategory",
          component: "Select",
          placeholder: "دسته بندی",
          options: [],
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "workAddress",
          component: "input",
          placeholder: "آدرس",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2",
        },
      ];
    case "livingFormik":
      return [
        {
          key: "country",
          component: "Select",
          options: countryOptions,
          placeholder: "کشور",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "province",
          component: "input",
          placeholder: "استان",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "city",
          component: "Select",
          options: cityOptions,
          placeholder: "شهر",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "street",
          component: "input",
          placeholder: "خیابان",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "postalCode",
          component: "input",
          placeholder: "کد پستی",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "category",
          component: "Select",
          placeholder: "دسته بندی",
          options: [],
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "address",
          component: "input",
          placeholder: "آدرس",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2",
        },
      ];
    case "organizatonFormik":
      return [
        {
          key: "organizationName",
          component: "input",
          placeholder: "نام",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "organizationCategory",
          component: "Select",
          placeholder: "دسته بندی",
          options: [
            {
              label: "hi",
              value: "hi",
            },
          ],
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "organizationAddress",
          component: "input",
          placeholder: "آدرس",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2",
        },
      ];
    case "livingContactFormik":
      return [
        {
          key: "personalPhone",
          component: "phone",
          placeholder: "تلفن همراه",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "homePhone",
          component: "input",
          placeholder: "شماره تلفن",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "email",
          component: "input",
          placeholder: "ایمیل",
          type: "email",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "website",
          component: "input",
          placeholder: "وب سایت",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
      ];
    case "workContactFormik":
      return [
        {
          key: "jobPhone",
          component: "input",
          placeholder: "تلفن محل کار",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "email",
          component: "input",
          placeholder: "ایمیل",
          type: "email",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
        {
          key: "website",
          component: "input",
          placeholder: "وب سایت",
          type: "text",
          floating: true,
          labelClassName: "w-full",
          className: "w-full md:w-1/2 lg:w-1/4",
        },
      ];
    default:
      return [];
  }
}
