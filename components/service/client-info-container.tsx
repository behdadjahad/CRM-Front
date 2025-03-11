import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import ClientInfoCard, { ClientInfoCardInterface } from "./client-info-card";
import { useEffect, useMemo, useState } from "react";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addCustomerData, getAllCustomers } from "@/api/customer";
import { useParams } from "next/navigation";

import CustomerManager from "./customer-manager";

export interface ClientInfoContainerInterface {
  clients: ClientInfoCardInterface[];
}

export default function ClientInfoContainer({
  clients,
}: ClientInfoContainerInterface) {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
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
    onSuccess: () => {},
  });
  function submitHandler() {
    submitCustomerHandler({
      fullName: "string",
      birthdate: "2000-01-01T00:00:00Z",
      idNumber: "string",
      phoneNumber: "string",
    });
  }
  const { data: allCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => getAllCustomers(),
  });

  useEffect(() => {
    if (allCustomers) {
      const customersData = allCustomers?.data?.map((customer: any) => ({
        id: customer?.id,
        firstName: customer?.person?.firstName,
        ssd: customer?.person?.idNumber,
        job: customer?.person?.personJobs?.[0]?.jobs?.name,
        lastName: customer?.person?.lastName,
        email: "alirezaebrahimi@gmail.com",
        phone: "989127359952",
      }));
      setCustomers(customersData);
    }
  }, [allCustomers]);

  const filteredCustomers = useMemo(() => {
    if (!customers.length) return []; // No customers available

    // If all filter values are empty, return an empty array
    if (Object.values(formik.values).every((value) => !value)) return [];

    return customers.filter(
      (customer) =>
        (formik.values.clientName
          ? customer.firstName
              .toLowerCase()
              .includes(formik.values.clientName.toLowerCase().trim())
          : true) &&
        (formik.values.clientFamily
          ? customer.lastName
              .toLowerCase()
              .includes(formik.values.clientFamily.toLowerCase().trim())
          : true) &&
        (formik.values.clientSSD
          ? customer.ssd
              ?.toLowerCase()
              .includes(formik.values.clientSSD.toLowerCase())
          : true) &&
        (formik.values.clientPhoneNumber
          ? customer.phone
              ?.toLowerCase()
              .includes(formik.values.clientPhoneNumber.toLowerCase())
          : true) &&
        (formik.values.clientEmail
          ? customer.email
              ?.toLowerCase()
              .includes(formik.values.clientEmail.toLowerCase())
          : true)
    );
  }, [formik.values, customers]);
  useEffect(() => {
    console.log(filteredCustomers);
  }, [formik.values]);

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
                onClick={() => setOpenSecondModal(true)}
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
                    setSelectedCustomers([]);
                  }}
                  className="cursor-pointer"
                />
              </div>

              <CustomerManager />

              <div className="flex flex-row gap-4 items-center justify-end">
                <Button
                  variant={"info"}
                  onClick={() => {
                    console.log(selectedCustomers);
                  }}
                >
                  ثبت
                </Button>
                <Button
                  variant={"foreground"}
                  onClick={() => {
                    setOpenSecondModal(false);
                    setSelectedCustomers([]);
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
          {filteredCustomers.length > 0 && (
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
                        clientSSD: customer.ssd || "",
                        clientPhoneNumber: customer.phone || "",
                        clientEmail: customer.email || "",
                      });
                    }}
                  >
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
                    <div className="text-foreground-mute">
                      {highlightMatch(
                        customer.phone,
                        formik.values.clientPhoneNumber
                      )}
                    </div>
                    <div className="text-foreground-mute">
                      {highlightMatch(customer.ssd, formik.values.clientSSD)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-row gap-4 items-center justify-end">
            <Button variant={"info"} onClick={submitHandler}>
              ثبت
            </Button>
            <Button variant={"foreground"} onClick={() => setOpenModal(false)}>
              لغو
            </Button>
          </div>
        </CustomModal>
      </div>
    </div>
  );
}
