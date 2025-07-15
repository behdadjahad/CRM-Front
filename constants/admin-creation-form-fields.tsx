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
            key: "price",
            component: "input",
            placeholder: "قیمت",
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
          price: "",
          description: "",
        },
      };
    case "unit-cost":
      return {
        title: "هزینه",
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
            key: "unitType",
            component: "Select",
            placeholder: "نوع فروش واحد",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
            options: [
              { label: "اجاره", value: "rent" },
              { label: "فروش", value: "sale" },
            ],
          },
          {
            key: "unitModel",
            component: "Select",
            placeholder: "مدل فروش واحد",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
            options: [
              { label: "مدت زمانی", value: "perDuration" },
              { label: "تعدادی", value: "perCount" },
              { label: "کامل", value: "flat" },
            ],
          },
          {
            key: "countUnit",
            component: "input",
            placeholder: "تعداد",
            type: "number",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "enabledDurationInDays",
            component: "input",
            placeholder: "مدت زمان امکان تعامل (روز)",
            type: "number",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "showDurationInDays",
            component: "input",
            placeholder: "مدت زمان امکان نمایش (روز)",
            type: "number",
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
          description: "",
        },
      };
    case "page":
      return {
        title: "صفحه",
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
            key: "code",
            component: "input",
            placeholder: "کد",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "url",
            component: "input",
            placeholder: "آدرس",
            type: "text",
            floating: true,
            labelClassName: "w-full ltr",
            className: "w-full md:w-1/2 ltr",
          },
        ],
        initialValues: {
          title: "",
          code: "",
          url: "",
        },
      };
    case "page-feature":
      return {
        title: "ویژگی",
        fields: [
          {
            key: "name",
            component: "input",
            placeholder: "نام",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
          {
            key: "code",
            component: "input",
            placeholder: "کد",
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
          {
            key: "urlPattern",
            component: "multi-added-input",
            placeholder: "آدرس ها",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
        ],
        initialValues: {
          name: "",
          code: "",
          description: "",
          urlPattern: [],
        },
      };
    case "role":
      return {
        title: "نقش",
        fields: [
          {
            key: "name",
            component: "input",
            placeholder: "نام",
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
