import { addCustomerData, addMultipleCustomerData } from "@/api/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";

import FormMaker from "../shared/form-maker";

import CustomerListSection from "./customer-list-section";
export default function CustomerManager() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [openThirdModal, setOpenThirdModal] = useState(false);

  const [selectedCustomersId, setSelectedCustomersId] = useState<number[]>([]);

  const formik = useFormik({
    initialValues: {
      clientName: "",
      clientFamily: "",
      clientSSD: "",
      clientPhoneNumber: "",
      clientEmail: "",
    },
    onSubmit: async () => {},
  });

  const { mutate: submitCustomerHandler } = useMutation({
    mutationFn: (data: any) => {
      return addCustomerData(data, Number(id));
    },
    onSuccess: () => {
      setOpenModal(false);
      formik.resetForm();
      queryClient.invalidateQueries({
        queryKey: ["contractCustomersData"],
      });
    },
  });

  function submitHandler() {
    submitCustomerHandler({
      firstName: formik.values.clientName,
      lastName: formik.values.clientFamily,
      idNumber: formik.values.clientSSD,
      phoneNumber: formik.values.clientPhoneNumber,
      email: formik.values.clientEmail,
    });
  }

  const { mutate: submitMultipleCustomerHandler } = useMutation({
    mutationFn: (data: any) => {
      return addMultipleCustomerData(data, Number(id));
    },
    onSuccess: () => {
      setOpenSecondModal(false);
      setOpenThirdModal(false);
      setSelectedCustomersId([]);
      queryClient.invalidateQueries({
        queryKey: ["contractCustomersData"],
      });
    },
  });
  function submitMultipleHandler(customerId: number, checked: boolean) {
    if (checked) {
      setSelectedCustomersId((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomersId((prev) => prev.filter((id) => id !== customerId));
    }
  }

  return (
    <div className="flex items-center justify-end">
      <Button
        variant={"foreground"}
        onClick={() => setOpenModal(true)}
        className="border-none"
      >
        <FaPlus size={10} className="text-primary-active" />

        <span className="text-xs text-primary-active">افزودن مشتری</span>
      </Button>
      <Button
        variant={"foreground"}
        onClick={() => {
          setOpenThirdModal(true);
          queryClient.removeQueries({ queryKey: ["customersData"] });
        }}
        className="border-none"
      >
        <FaPlus size={10} className="text-primary-active" />

        <span className="text-xs text-primary-active">
          انتخاب از لیست مشتری
        </span>
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openThirdModal}
        onRequestClose={() => setOpenThirdModal(false)}
        contentLabel="لیست مشتری ها"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">لیست مشتری ها</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenThirdModal(false);
              setSelectedCustomersId([]);
            }}
            className="cursor-pointer"
          />
        </div>

        <CustomerListSection
          onCheckCustomerhandler={submitMultipleHandler}
          key="third-modal"
        />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              submitMultipleCustomerHandler(selectedCustomersId);
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenThirdModal(false);
              setSelectedCustomersId([]);
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="اضافه کردن مشتری"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-bold">اضافه کردن مشتری</span>
              <MdClose
                size={20}
                onClick={() => {
                  setOpenModal(false);
                  formik.resetForm();
                }}
                className="cursor-pointer"
              />
            </div>

            <Button
              variant={"foreground"}
              onClick={() => {
                setOpenSecondModal(true);
                queryClient.removeQueries({
                  queryKey: ["customersData"],
                });
              }}
              className="border-none self-end"
            >
              <FaPlus size={10} className="text-primary-active" />
              <span className="text-xs text-primary-active">
                انتخاب از لیست مشتری ها
              </span>
            </Button>
          </div>
          {/*Second Modal*/}
          <CustomModal
            minWidth="0"
            maxWidth="700px"
            isOpen={openSecondModal}
            onRequestClose={() => setOpenSecondModal(false)}
            contentLabel="لیست مشتری ها"
          >
            <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
              <span className="text-lg font-bold">لیست مشتری ها</span>
              <MdClose
                size={20}
                onClick={() => {
                  setOpenSecondModal(false);
                  setSelectedCustomersId([]);
                }}
                className="cursor-pointer"
              />
            </div>

            <CustomerListSection
              onCheckCustomerhandler={submitMultipleHandler}
              key="second-modal"
            />
            <div className="flex flex-row gap-4 items-center justify-end">
              <Button
                variant={"info"}
                onClick={() => {
                  submitMultipleCustomerHandler(selectedCustomersId);
                }}
              >
                ثبت
              </Button>
              <Button
                variant={"foreground"}
                onClick={() => {
                  setOpenSecondModal(false);
                  setSelectedCustomersId([]);
                }}
              >
                لغو
              </Button>
            </div>
          </CustomModal>
          {/*Second Modal*/}
        </div>

        <div className="w-full flex flex-col items-end gap-8">
          <FormMaker
            form={formik}
            fields={[
              {
                key: "clientName",
                component: "input",
                placeholder: "نام",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "clientFamily",
                component: "input",
                placeholder: "نام خانوادگی",
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
                key: "clientEmail",
                component: "input",
                placeholder: "ایمیل",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        {/* {filteredCustomers.length > 0 && (
          <div className="p-2 max-h-60 overflow-y-auto flex flex-col gap-2">
            {filteredCustomers.map((customer) => {
              const highlightMatch = (text = "", search = "") => {
                if (!search.trim()) return text;
                const parts = text.split(new RegExp(`(${search})`, "gi"));
                return parts.map((part, index) =>
                  part.toLowerCase() === search.toLowerCase() ? (
                    <span key={index} className="text-yellow-600 font-bold">
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                );
              };

              return (
                <div
                  key={customer.id}
                  className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    formik.setValues({
                      clientName: customer.firstName || "",
                      clientFamily: customer.lastName || "",
                      clientSSD: customer.idNumber || "",
                      clientPhoneNumber: customer.phone || "",
                      clientEmail: customer.email || "",
                    });
                  }}
                >
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <Image
                      src={"/icons/customer.png"}
                      alt="edit"
                      width={18}
                      height={18}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-primary-bold">
                        {highlightMatch(
                          customer.firstName,
                          formik.values.clientName
                        )}{" "}
                        {highlightMatch(
                          customer.lastName,
                          formik.values.clientFamily
                        )}
                      </span>
                      <span className="text-sm text-foreground-mute">
                        {highlightMatch(
                          customer.email,
                          formik.values.clientEmail
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-foreground-mute gap-2">
                    <Image
                      src={"/icons/customerMobile.png"}
                      alt="edit"
                      width={12}
                      height={12}
                    />
                    <span>
                      {highlightMatch(
                        customer.phone,
                        formik.values.clientPhoneNumber
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-foreground-mute gap-2">
                    <Image
                      src={"/icons/customerID.png"}
                      alt="edit"
                      width={18}
                      height={18}
                    />
                    <span>
                      {highlightMatch(
                        customer.idNumber,
                        formik.values.clientSSD
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )} */}
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button variant={"info"} onClick={submitHandler}>
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
              formik.resetForm();
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
    </div>
  );
}
