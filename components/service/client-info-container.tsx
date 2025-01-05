import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import ClientInfoCard, { ClientInfoCardInterface } from "./client-info-card";
import { useState } from "react";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ClientInfoContainerInterface {
  clients: ClientInfoCardInterface[];
}

export default function ClientInfoContainer({
  clients,
}: ClientInfoContainerInterface) {
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      number: "",
      contractDate: "",
      submitter: "",
      accountant: "",
      description: "",
    },
    onSubmit: async () => {},
  });

  const [category, setCategory] = useState("personal");

  return (
    <div className="bg-card p-4 rounded-lg overflow-hidden flex flex-col gap-4">
      <h2 className="text-foreground text-lg">اطلاعات مشتری</h2>
      <div className="flex flex-col gap-4">
        {clients.map((item, index) => (
          <ClientInfoCard key={`client-${index}`} {...item} />
        ))}
      </div>

      <div className="flex items-center justify-end">
        <Button
          variant={"foreground"}
          onClick={() => setOpenModal(true)}
          className="border-none"
        >
          <FaPlus size={10} className="text-primary-active" />

          <span className="text-xs text-primary-active">افزودن مشتری</span>
        </Button>

        <CustomModal
          minWidth="0"
          maxWidth="610px"
          isOpen={openModal}
          onRequestClose={() => setOpenModal(false)}
          contentLabel="ویرایش"
        >
          <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
            <span className="text-lg font-bold">اضافه کردن مشتری</span>

            <MdClose
              size={20}
              onClick={() => setOpenModal(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-4">
            <RadioGroup
              defaultValue="personal"
              className="flex flex-row-reverse gap-4"
            >
              <div className="flex items-center space-x-2">
                <label htmlFor="personal">شخصی</label>
                <RadioGroupItem
                  value="personal"
                  id="personal"
                  onClick={() => setCategory("personal")}
                />
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="organization">سازمانی</label>
                <RadioGroupItem
                  value="organization"
                  id="organization"
                  onClick={() => setCategory("organization")}
                />
              </div>
            </RadioGroup>

            <div className="w-full flex flex-col items-end gap-8">
              {category === "personal" ? (
                <FormMaker
                  form={formik}
                  fields={[
                    {
                      key: "nameFamily",
                      component: "input",
                      placeholder: "نام و نام خانوادگی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientBirthDate",
                      component: "date",
                      placeholder: "تاریخ تولد",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientSSD",
                      component: "input",
                      placeholder: "کدملی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientPhoneNumber",
                      component: "input",
                      placeholder: "شماره تماس",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientCity",
                      component: "input",
                      placeholder: "محل سکونت",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                  ]}
                  className="flex flex-row w-full"
                />
              ) : (
                <FormMaker
                  form={formik}
                  fields={[
                    {
                      key: "nameFamily",
                      component: "input",
                      placeholder: "نام و نام خانوادگی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientBirthDate",
                      component: "date",
                      placeholder: "تاریخ تولد",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientSSD",
                      component: "input",
                      placeholder: "کدملی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientPhoneNumber",
                      component: "input",
                      placeholder: "شماره تماس",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientCity",
                      component: "input",
                      placeholder: "محل سکونت",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                  ]}
                  className="flex flex-row w-full"
                />
              )}
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center justify-end">
            <Button variant={"info"}>ثبت</Button>
            <Button variant={"foreground"} onClick={() => setOpenModal(false)}>
              لغو
            </Button>
          </div>
        </CustomModal>
      </div>
    </div>
  );
}
