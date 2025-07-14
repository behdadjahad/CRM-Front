import { PageInterface } from "@/app/(admin-layout)/admin/page/page";
import PageTable from "../tables/page-table";
import CreationForm from "../forms/creation-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { addPage } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export interface PageContainerInterface {
  pageList: PageInterface[];
}
export default function PageContainer({ pageList }: PageContainerInterface) {
  const queryClient = useQueryClient();
  const { pageFormData } = getData("page");
  const { mutate: addPageHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      title: values.title,
      code: values.code,
      url: values.url,
    };
    addPageHandler(data);
  }
  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...pageFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        صفحه
      </div>
      <PageTable pageList={pageList} />
    </div>
  );
}
function getData(formType: string) {
  const formData: formDataInterface = createFormFields(formType);
  const pageFormData = {
    title: formData.title,
    fields: formData.fields,
    initialValues: formData.initialValues,
  };

  return { pageFormData };
}
