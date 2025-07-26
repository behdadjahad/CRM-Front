import { FieldType } from "@/components/shared/form-maker";
export interface formDataInterface {
  fields: FieldType[];
  initialValues: any;
}
export function createFormFields(formType: string): formDataInterface {
  switch (formType) {
    case "managerPersonal":
      return {
        fields: [
          {
            key: "firstName",
            component: "input",
            placeholder: "نام",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "lastName",
            component: "input",
            placeholder: "نام خانوادگی",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "managerBirthDate",
            dependantKey: "managerBirthDateType",
            component: "date",
            placeholder: "تاریخ تولد",
            type: "text",
            floating: true,
            className: "w-full md:w-1/4",
          },
          {
            key: "idNumber",
            component: "input",
            placeholder: "کدملی",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
        ],
        initialValues: {
          managerBirthDate: "",
        },
      };
    case "managerContact":
      return {
        fields: [
          {
            key: "mobilePhone",
            component: "phone",
            placeholder: "تلفن همراه",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "homePhone",
            component: "input",
            placeholder: "شماره تلفن",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "workPhone",
            component: "input",
            placeholder: "تلفن محل کار",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "email",
            component: "input",
            placeholder: "ایمیل",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
     
        ],
        initialValues: {
          mobilePhone: "",
          homePhone: "",
          workPhone: "",
          email: "",
        },
      };
    case "companyInfo":
      return {
        fields: [
          {
            key: "companyName",
            component: "input",
            placeholder: "نام شرکت",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "brandName",
            component: "input",
            placeholder: "نام برند",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "registrationNumber",
            component: "input",
            placeholder: "شماره ثبت",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "idNumber",
            component: "input",
            placeholder: "کدملی",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
          },
          {
            key: "companyType",
            component: "Select",
            placeholder: "نوع شرکت",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
            options:[]
          },
          {
            key: "country",
            component: "Select",
            placeholder: "کشور",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
            options:[]
          },
          {
            key: "province",
            component: "Select",
            placeholder: "استان",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
            options:[]
          },
          {
            key: "city",
            component: "Select",
            placeholder: "شهر",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/4",
            options:[]
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
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full",
         },
     
        ],
        initialValues: {
          companyName: "",
          brandName: "",
          registrationNumber: "",
          idNumber: "",
          address:"",
          description:"",
        },
      };
    default:
      return {
        fields: [],
        initialValues: {},
      };
  }
}
