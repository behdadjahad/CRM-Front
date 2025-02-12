import { sendHotelData } from "@/api/accommodation";
import FormMaker from "@/components/shared/form-maker";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { cn, REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import RoomForm from "./room-form";

export default function HotelForm({
  // id,
  countries,
  cities,
  hotels,
  serviceTypes,
  accommodationTypes,
}: any) {
  console.log(serviceTypes)
  const [hotelId, setHotelId] = useState<number>();
  const [roomKeys, setRoomKeys] = useState<string[]>([]);
  const formik = useFormik({
    initialValues: {
      country: "",
      city: "",
      hotelName: "",
      serviceType: "",
      voucherFile: "",
    },
    validationSchema: Yup.object().shape({
      province: Yup.string().required(REQUIRED_TEXT),
      city: Yup.string().required(REQUIRED_TEXT),
      street: Yup.string().required(REQUIRED_TEXT),
      postalCode: Yup.string().required(REQUIRED_TEXT),
      category: Yup.string().required(REQUIRED_TEXT),
      address: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => { },
    enableReinitialize:true
  });

  const { mutate: hotelSubmitter } = useMutation({
    mutationFn: (data: any) => {
      // return sendHotelData(data, Number(id));
      return sendHotelData(data, 66);
    },
    onSuccess: (data: any) => {
      setHotelId(data.id);
    },
  });

  function submitForm(data: any) {
    hotelSubmitter({
      accommodationId: data.hotelName,
      serviceTypeId: data.serviceType,
      files: data.voucherFile,
    });
    console.log(data);
  }
  function addRoomForm() {
    const key = `new-hotel-form-${roomKeys.length + 1}`;
    setRoomKeys([...roomKeys, key]);
  }
  return (
    <div>
      <FormMaker
        form={formik}
        fields={[
          {
            component: "non-field",
            key: "addActions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button
                  variant={"transparent"}
                  onClick={addRoomForm}
                  className={cn(
                    "mr-auto w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
                  )}
                >
                  <FaPlus className="text-white" />
                </Button>
              </div>
            ),
          },
          {
            key: "country",
            component: "Select",
            placeholder: "کشور",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: countries,
          },
          {
            key: "city",
            component: "Select",
            placeholder: "شهر",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: cities,
          },
          {
            key: "accommodationType",
            component: "Select",
            placeholder: "نوع اقامت",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: accommodationTypes,
          },
          {
            key: "hotelName",
            component: "Select",
            placeholder: "نام هتل",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: hotels,
          },
          {
            key: "serviceType",
            component: "list-preview",
            title: "نوع خدمات",
            options: serviceTypes,
          },
          {
            key: "voucherFile",
            component: "file",
            placeholder: "",
            type: "file",
            floating: true,
            icon: "/icons/vector.png",
            className: "w-full",
          },
          {
            component: "file-preview",
            key: "filePreview",
            dependantKey: "voucherFile",
            className: "w-full",
          },
          {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button
                  variant="info"
                  onClick={() => {
                    submitForm(formik.values);
                  }}
                >
                    ثبت اقامتگاه 
                </Button>
                <Button
                  onClick={() => {
                    // submitForm(formik.values);
                  }}
                >
                  حذف اقامتگاه
                </Button>
              </div>
            ),
          },
 
        ]}
        className=""
      />

      {roomKeys.map((item: any) => (
        <RoomForm id={item} key={item} hotelId={hotelId} />
      ))}
    </div>
  );
}

/**
 * 
              {form.children.map((item: any) => (
                <div key={item.id}>
                  <RoomForm hotelId={item.hotelId} />
                </div>
              ))}
 */
