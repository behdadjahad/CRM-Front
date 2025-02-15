import {
  editHotelData,
  getSubmittedRooms,
  sendHotelData,
} from "@/api/accommodation";
import FormMaker from "@/components/shared/form-maker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn, REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import RoomForm from "./room-form";

export default function HotelForm({
  id,
  countries,
  cities,
  hotels,
  serviceTypes,
  accommodationTypes,
  onRemoveHandler,
  hotel,
}: any) {
  const [hotelId, setHotelId] = useState<number>();
  const [addedRooms, setAddedRooms] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      country: hotel?.country,
      city: hotel?.city,
      hotelName: hotel?.hotel,
      serviceType: hotel?.serviceType,
      accommodationType: "",
      voucherFile: "",
      id: hotel?.id,
    },
    validationSchema: Yup.object().shape({
      city: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const { mutate: roomMutation } = useMutation({
    mutationKey: ["submittedRooms"],
    mutationFn: (id: number) => getSubmittedRooms(id),
    onSuccess: ({ data }) => {
      setAddedRooms(
        data.map((item: any) => ({
          checkInDate: item?.checkInDate,
          checkOutDate: item?.checkOutDate,
          numberOfRooms: item?.numberOfRooms,
          priceWeBuyPerNight: item?.priceWeBuyPerNight,
          id: item?.id,
          roomTypeId: item?.acRoomTypeId,
        }))
      );
    },
  });

  useEffect(() => {
    if (hotel?.id) roomMutation(hotel?.id);
  }, []);

  const { mutate: hotelSubmitter } = useMutation({
    mutationFn: (data: any) => {
      return sendHotelData(data, Number(id));
    },
    onSuccess: (data: any) => {
      setHotelId(data.id);
    },
  });

  const { mutate: hotelEditor } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editHotelData(data, id);
    },
  });

  function submitForm(data: any) {
    if (data.id) {
      hotelEditor({
        data: {
          accommodationId: data.hotelName,
          serviceTypeId: data.serviceType,
          files: data.voucherFile,
        },
        id: data.id,
      });
    } else {
      hotelSubmitter({
        accommodationId: data.hotelName,
        serviceTypeId: data.serviceType,
        files: data.voucherFile,
      });
    }
  }

  function addRoomForm() {
    const key = `new-hotel-form-${addedRooms.length + 1}`;
    setAddedRooms([...addedRooms, key]);
  }

  function removeForm(formId: string) {
    onRemoveHandler(formId);
  }

  function removeHandler(formId: string) {
    const updatedRoomKeys = addedRooms.filter((key) => key != formId);
    setAddedRooms(updatedRoomKeys);
  }

  return (
    <div className="bg-card flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4 p-2">
        <h2>اقامتگاه</h2>
        <Button
          variant={"transparent"}
          onClick={addRoomForm}
          className={cn(
            " w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
          )}
        >
          <FaPlus className="text-white" />
        </Button>
      </div>

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
                    removeForm(id);
                  }}
                  className="text-danger border-danger"
                >
                  حذف اقامتگاه
                </Button>
              </div>
            ),
          },
        ]}
        className=""
      />

      {addedRooms.map((item: any, index: any) => (
        <RoomForm
          id={item.id}
          key={`room-${item.id}-${index}`}
          hotelId={hotel ? hotel.id : hotelId}
          onRemoveHandler={removeHandler}
          room={addedRooms[index]}
        />
      ))}
    </div>
  );
}
