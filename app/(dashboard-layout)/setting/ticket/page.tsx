"use client";

import SettingContainer from "@/components/setting/station/setting-container";
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

      <div className="flex flex-col gap-4 ">
        <div className="rounded-md p-3 flex flex-col gap-4 bg-card">
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
                className: "w-full md:w-1/4",
                options: [],
              },
              {
                key: "city",
                component: "Select",
                placeholder: "شهر",
                type: "text",
                floating: true,
                className: "w-full md:w-1/4",
                options: [],
              },
              {
                key: "airport",
                component: "Select",
                placeholder: "فرودگاه",
                type: "text",
                floating: true,
                className: "w-full md:w-1/4",
                options: [],
              },

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
      <SettingContainer />
    </main>
  );
}
