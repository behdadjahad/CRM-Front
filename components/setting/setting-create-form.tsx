import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";

export default function SettingCreateForm({
  form,
  fields,
  title,
}: {
  form: any;
  fields: any[];
  title: any;
}) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="rounded-md p-3 flex flex-col gap-4 bg-card">
        <h2> {`ثبت ${title}`}</h2>
        <FormMaker
          form={form}
          fields={[
            ...fields,
            {
              component: "non-field",
              key: "actions",
              children: (
                <Button variant="info" onClick={() => {}}>
                  ثبت
                </Button>
              ),
              className: "w-full md:w-1/4",
            },
          ]}
        />
      </div>
    </div>
  );
}
