"use client";
import Breadcrumb from "@/components/shared/breadcrumb";
import FormMaker from "@/components/shared/form-maker";
import Title from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";

export default function ServiceSetting() {
  const formik = useFormik({
    initialValues: {
      country: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <main>
      <div>
        <Title label="ثبت اطلاعات سرویس" />
        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "اطلاعات سرویس",
          
            },
         
          ]}
        />
      </div>
      <div className="rounded-xl grid grid-cols-4 gap-4">
        <div
          className={cn(
            "bg-card rounded-xl col-span-3 p-3 flex flex-col gap-4",
            ""
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-gray-400 p-3 flex flex-col gap-4">
              <h2>ثبت فرودگاه</h2>{" "}
              <FormMaker
                form={formik}
                fields={[
                  {
                    key: "country",
                    component: "Select",
                    placeholder: "کشور",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/3",
                    options: [],
                  },
                  {
                    key: "city",
                    component: "Select",
                    placeholder: "شهر",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/3",
                    options: [],
                  },
                  {
                    key: "airport",
                    component: "Select",
                    placeholder: "فرودگاه",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/3",
                    options: [],
                  },

                  {
                    component: "non-field",
                    key: "actions",
                    children: (
                      <div className="flex flex-row items-center gap-2 justify-end w-full">
                        <Button variant="info" onClick={() => {}}>
                          ثبت
                        </Button>
                      </div>
                    ),
                  },
                ]}
                className=""
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-gray-400 p-3 flex flex-col gap-4">
              <h2> ثبت ایرلاین</h2>{" "}
              <FormMaker
                form={formik}
                fields={[
                  {
                    key: "airline",
                    component: "Select",
                    placeholder: "ایرلاین",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/3",
                    options: [],
                  },

                  {
                    component: "non-field",
                    key: "actions",
                    children: (
                      <div className="flex flex-row items-center gap-2 justify-end w-full">
                        <Button variant="info" onClick={() => {}}>
                          ثبت
                        </Button>
                      </div>
                    ),
                  },
                ]}
                className=""
              />
            </div>
          </div>
        </div>
        <div className=" bg-card rounded-xl col-span-1 p-3">
          <h2>موارد ثبت شده</h2>
        </div>
      </div>
    </main>
  );
}
