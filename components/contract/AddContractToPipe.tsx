import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
export default function AddContractToPipe() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button variant={"info"} onClick={() => setOpenModal(true)} className="w-full">
        <Image
          src={"/icons/narrow-plus.svg"}
          alt="قرارداد جدید"
          width={1024}
          height={1024}
          className="w-5 h-5"
        />
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="ویرایش"
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          <span className="text-lg font-bold">ثبت قرارداد</span>

          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            //   formik.resetForm();
            //   setActiveItem(null);
            }}
            className="cursor-pointer"
          />
        </div>

        {/* <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 text-base">
            <span>موضوع قرارداد</span>
            <div className="flex flex-row flex-wrap items-center gap-2 w-full">
              {contractTypes.map((item) => (
                <ServiceCard
                  key={item.id}
                  {...item}
                  clickFunction={() => {
                    if (activeItem && activeItem.title === item.title) {
                      setActiveItem(null);
                      formik.setFieldValue("number", " ");
                    } else {
                      setActiveItem(item);
                      mutate(Number(item.id));
                    }
                  }}
                  isActive={activeItem && activeItem.title == item.title}
                  className="min-w-18 w-18 max-w-18 h-auto text-[8px] text-right items-start "
                  imageClassName="min-w-0 h-15"
                />
              ))}
            </div>
          </div>

          <FormMaker
            form={formik}
            fields={[
              {
                key: "number",
                component: "input",
                placeholder: "شماره قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                readonly: true,
                disabled: true,
                defaultValue: formik.values.number,
              },
              {
                key: "contractDate",
                dependantKey: "contractDateType",
                component: "date",
                placeholder: "تاریخ قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "submitter",
                component: "input",
                placeholder: "ثبت کننده",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                defaultValue: userData?.fullName,
              },
              {
                key: "accountant",
                component: "Select",
                placeholder: "مسئول قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: userOptions,
              },
              {
                key: "country",
                component: "Select",
                placeholder: "کشور",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: countryOptions,
              },
              {
                key: "city",
                component: "Select",
                placeholder: "شهر",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: cityOptions,
              },
              {
                key: "description",
                component: "textarea",
                placeholder: "توضیحات",
                type: "text",
                floating: true,
                className: "w-full",
              },
            ]}
            className="flex flex-row w-full"
          />

          <div className="flex flex-row gap-2">
            <Button
              variant={"info"}
              onClick={() => {
                contractSubmitHandler(true);
              }}
            >
              ثبت و جدید
            </Button>
            <Button
              variant={"info"}
              onClick={() => {
                contractSubmitHandler(false);
              }}
            >
              ثبت و تکمیل
            </Button>
            <Button
              variant={"foreground"}
              onClick={() => {
                setOpenModal(false);
                formik.resetForm();
                setActiveItem(null);
              }}
            >
              لغو
            </Button>
          </div>
        </div> */}
      </CustomModal>
    </>
  );
}
