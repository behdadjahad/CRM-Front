import { FieldType, OptionType } from "@/components/shared/form-maker";
export interface formDataInterface {
  fields: FieldType[];
  initialValues: any;
  title: string;
}
export function createFormFields(
  formType: string,
  currencyOptions?: OptionType[]
): formDataInterface {
  switch (formType) {
    case "package":
      return {
        title: "پکیج",
        fields: [
          {
            key: "title",
            component: "input",
            placeholder: "عنوان",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "price",
            component: "input",
            placeholder: "قیمت",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "currency",
            component: "Select",
            placeholder: "ارز",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
            options: currencyOptions,
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
        ],
        initialValues: {
          title: "",
          price: "",
          currency: "",
          description: "",
        },
      };
    case "category":
      return {
        title: "دسته بندی",
        fields: [
          {
            key: "name",
            component: "input",
            placeholder: "عنوان",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "price",
            component: "input",
            placeholder: "قیمت",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "currency",
            component: "Select",
            placeholder: "ارز",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
            options: currencyOptions,
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
        ],
        initialValues: {
          name: "",
          price: "",
          currency: "",
          description: "",
        },
      };
    case "package-unit":
      return {
        title: "واحد پکیج",
        fields: [
          {
            key: "name",
            component: "input",
            placeholder: "عنوان",
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
            className: "w-full md:w-1/2",
          },
        ],
        initialValues: {
          name: "",
          description: "",
        },
      };
    default:
      return {
        title: "",
        fields: [],
        initialValues: {},
      };
  }
}
