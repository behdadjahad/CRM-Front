import { createSettingSubmitData, getTitleFromSlug } from "@/constants/setting";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

export default function SettingCreateForm({
  form,
  fields,
  title,
  onSubmitHandler
}: {
  form: any;
  fields: any[];
    title: any;
  onSubmitHandler: (data: any) => any;
}) {
  const { service } = useParams();
  return (
    <div className="flex flex-col gap-4 ">
      <div className="rounded-md p-3 flex flex-col gap-4 bg-card">
        <h2> {`ثبت ${getTitleFromSlug(service)}`}</h2>
        <FormMaker
          form={form}
          fields={[
            ...fields,
            {
              component: "non-field",
              key: "actions",
              children: (
                <Button
                  variant="info"
                  onClick={() => {
                    onSubmitHandler(createSettingSubmitData(service, form));
                  }}
                 
                >
                  ثبت
                </Button>
              ),
              className: "w-full md:w-1/4 flex items-start",
            },
          ]}
        />
      </div>
    </div>
  );
}
