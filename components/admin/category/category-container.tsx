import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import CreationForm from "../forms/creation-form";
import { CategoryInterface } from "@/app/(admin-layout)/admin/category/page";
import CategoryTable from "../tables/category-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPackageCategory } from "@/api/admin";
export interface CategoryContainerInterface {
  categoryList: CategoryInterface[];
}
export default function CategoryContainer({
  categoryList,
}: CategoryContainerInterface) {
  const { categoryFormData } = getData("category");
  const queryClient = useQueryClient();
  const { mutate: addCategoryHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPackageCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      name: values.name,
      description: values.description,
      price: Number(values.price),
      currencyId: values.currencyId,
    };
    addCategoryHandler(data);
  }

  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...categoryFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        دسته بندی پکیج
      </div>
          <CategoryTable categoryList={categoryList} isPackageSubTable={false} />
    </div>
  );
}
function getData(formType: string) {
  const formData: formDataInterface = createFormFields(formType);
  const categoryFormData = {
    title: formData.title,
    fields: formData.fields,
    initialValues: formData.initialValues,
  };

  return { categoryFormData };
}
