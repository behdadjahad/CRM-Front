import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import Image from "next/image";
export interface EventCreationContainerInterface {
  trigger?: React.ReactElement;
}
export default function EventCreationContainer({
  trigger,
}: EventCreationContainerInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <>
      {trigger ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(true);
          }}
          className="cursor-pointer"
        >
          <div style={{ pointerEvents: "none" }}>{trigger}</div>
        </div>
      ) : (
        <></>
      )}
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-col gap-4">
          {" "}
          <div className="flex flex-row reverse w-full items-center justify-between">
            <span className="text-lg font-bold">افزودن رویداد</span>
            <MdClose
              size={20}
              onClick={() => {
                setOpenModal(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <FormMaker
            form={formik}
            fields={[
              {
                key: "date-sample",
                component: "non-field",
                children: (
                  <div className="w-full h-full">
                    {" "}
                    <Image
                      src={"/icons/calendar-time.png"}
                      alt="edit"
                      width={1024}
                      height={1024}
                      className="w-6 h-6"
                    />
                  </div>
                ),
                className: "grid col-span-2 justify-end",
              },
              {
                key: "startDateTime",
                component: "date-time",
                placeholder: "تاریخ و زمان شروع",
                type: "text",
                className: "grid col-span-5",
                labelClassName: "text-sm placeholder:text-sm",
                dependantKey: "startDateTimeType",
              },
              {
                key: "endDateTime",
                component: "date-time",
                placeholder: "تاریخ و زمان پایان",
                type: "text",
                className: "grid col-span-5",
                labelClassName: "text-sm placeholder:text-sm",
                dependantKey: "endDateTimeType",
              },
              {
                key: "date-sample",
                component: "non-field",
                children: <div className="w-4 h-4"></div>,
                className: "grid col-span-2",
              },
              {
                key: "temperature",
                component: "Select",
                placeholder: "میزان علاقه مندی",
                labelClassName: "text-sm placeholder:text-sm",
                type: "text",
                className: "grid col-span-10",
              },
              {
                key: "date-sample",
                component: "non-field",
                children: <div className="w-4 h-4"></div>,
                className: "grid col-span-2",
              },
              {
                key: "location",
                component: "input",
                type: "text",
                className: "grid col-span-10",
              },
            ]}
            className="grid grid-cols-12 items-center"
          />
        </div>
      </CustomModal>
    </>
    );
    
}
