import { createSettingSubmitData, getTitleFromSlug } from "@/constants/setting";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { usePageData } from "@/hooks/usePageData";
import { AccessDenied } from "../shared/AccessDenied";

export default function SettingCreateForm({
  form,
  fields,
  title,
  hasAccess,
  onSubmitHandler
}: {
  form: any;
  fields: any[];
  title: any;
  hasAccess: boolean
  onSubmitHandler: (data: any) => any;
}) {
  const { service } = useParams();
  console.log(hasAccess, "hasAccess111")

  return (
    <div className="flex flex-col gap-4 ">
      <div className="rounded-md p-3 flex flex-col gap-4 bg-card">
        <h2> {`ثبت ${getTitleFromSlug(service)}`}</h2>
        <FormMaker
          disabled={hasAccess}
          form={form}
          fields={[
            ...fields,
            {
              component: "non-field",
              key: "actions",
              children: (
                hasAccess ? (<Button
                  variant="info"
                  onClick={() => {
                    onSubmitHandler(createSettingSubmitData(service, form));
                  }}

                >
                  ثبت
                </Button>) : (<AccessDenied
                  variant={""}
                  title=" ثبت "
                  message="شما به این بخش دسترسی ندارید"

                />)


              ),
              className: "w-full md:w-1/4 flex items-start",
            },
          ]}
        />
      </div>
    </div>
  );
}
