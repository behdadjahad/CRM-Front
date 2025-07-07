import {
  addCategorytoPackage,
  addPackage,
  addPackageCategory,
  addPackageUnit,
  deletePackage,
  deletePackageCategory,
  deletePackageUnit,
  editPackage,
  editPackageCategory,
  editPackageUnit,
  getPackage,
  getPackageCategory,
  getPackageUnit,
} from "@/api/role-management";

export const roleManagementData = [
  {
    key: "package",
    title: "پکیج",
    fields: [
      {
        key: "title",
        component: "input",
        placeholder: "نام پکیج",
        type: "text",
        floating: true,
        className: "w-full md:w-1/6",
      },
      {
        key: "price",
        component: "input",
        placeholder: "قیمت",
        type: "text",
        floating: true,
        className: "w-full md:w-1/6",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
    ],
    editFields: [
      {
        key: "title",
        component: "input",
        placeholder: "نام پکیج",
        type: "text",
        floating: true,
        className: "w-full",
      },
      {
        key: "price",
        component: "input",
        placeholder: "قیمت",
        type: "text",
        floating: true,
        className: "w-full",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full",
      },
    ],
    mapData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        list: [
          { label: "نام پکیج", value: item.title },
          { label: "توضیحات", value: item.description },
          { label: "قیمت", value: item.price },
        ],
        packageCategories: item?.packageCategories?.map((category:any) => ({
          id: category.id,
          name: category.name,
          description:category.description
        }))
      })),
    mapEditData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        title: item.title,
        price: item.price,
        description: item.description,
      })),
    initialValues: {
      title: "",
      description: "",
      price: "",
    },
    createSubmitionData: (values: any) => {
      return {
        title: values.title,
        description: values.description,
        price: values.price,
      };
    },
    getData: () => getPackage(),
    addData: (data: any) => addPackage(data),
    editData: ({ value, data }: { value: number; data: any }) =>
      editPackage(value, data),
    deleteData: (value: number) => deletePackage(value),
  },
  {
    key: "packageCategory",
    title: "دسته بندی پکیج",
    fields: [
      {
        key: "name",
        component: "input",
        placeholder: "نام دسته بندی",
        type: "text",
        floating: true,
        className: "w-full md:w-1/6",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
    ],
    editFields: [
      {
        key: "name",
        component: "input",
        placeholder: "نام دسته بندی",
        type: "text",
        floating: true,
        className: "w-full",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full",
      },
    ],
    mapData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        list: [
          { label: "نام دسته بندی", value: item.name },
          { label: "توضیحات", value: item.description },
        ],
      })),
    mapEditData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        name: item.name,

        description: item.description,
      })),
    initialValues: {
      name: "",
      description: "",
    },
    subInitialValues: {
      title: "",
      description: "",
    },
    createSubmitionData: (values: any) => {
      return {
        name: values.name,
        description: values.description,
      };
    },
    getData: () => getPackageCategory(),
    addData: (data: any) => addPackageCategory(data),
    editData: ({ value, data }: { value: number; data: any }) =>
      editPackageCategory(value, data),
    deleteData: (value: number) => deletePackageCategory(value),
    assignData: ({items,itemId }: { items: number[], itemId: number })=>addCategorytoPackage(items,itemId),
  },
];
export const packageUnitData = [
  {
    key: "packageUnit",
    title: "واحد پکیج",
    fields: [
      {
        key: "name",
        component: "input",
        placeholder: "نام واحد پکیج",
        type: "text",
        floating: true,
        className: "w-full md:w-1/6",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
    ],
    editFields: [
      {
        key: "name",
        component: "input",
        placeholder: "نام واحد پکیج",
        type: "text",
        floating: true,
        className: "w-full",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full",
      },
    ],
    subFields: [
      {
        key: "title",
        component: "input",
        placeholder: "نام پلن هزینه",
        type: "text",
        floating: true,
        className: "w-full",
      },
      {
        key: "description",
        component: "input",
        placeholder: "توضیحات",
        type: "text",
        floating: true,
        className: "w-full",
      },
    ],
    mapData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        list: [
          { label: "نام واحد پکیج", value: item.name },
          { label: "توضیحات", value: item.description },
        ],
      })),
    mapEditData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        name: item.name,
        description: item.description,
      })),
    initialValues: {
      name: "",
      description: "",
    },
    subInitialValues: {
      title: "",
      description: "",
    },
    createSubmitionData: (values: any) => {
      return {
        name: values.name,
        description: values.description,
      };
    },
    getData: () => getPackageUnit(),
    addData: (data: any) => addPackageUnit(data),
    addSubData: (data: any) => addPackageUnit(data),
    editData: ({ value, data }: { value: number; data: any }) =>
      editPackageUnit(value, data),
    editSubData: ({ value, data }: { value: number; data: any }) =>
      editPackageUnit(value, data),
    deleteData: (value: number) => deletePackageUnit(value),
    deleteSubData: (value: number) => deletePackageUnit(value),
  },
];
