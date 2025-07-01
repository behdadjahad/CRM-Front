import {
  addPackage,
  deletePackage,
  editPackage,
  getPackage,
} from "@/api/role-management";

export const roleManagementData = [
  {
    key: "packageData",
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
        key: "description",
        component: "input",
        placeholder: "توضیحات",
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
        key: "description",
        component: "input",
        placeholder: "توضیحات",
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
    ],
    mapData: (data: any[]) =>
      data.map((item) => ({
        id: item?.id,
        list: [
          { label: "نام پکیج", value: item.title },
          { label: "توضیحات", value: item.description },
          { label: "قیمت", value: item.price },
        ],
      })),
    mapEditData: (data: any[]) =>
      data.map((item) => ({
          id: item?.id,
          title: item.title,
          price: item.price,
          description:item.description,
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
];
