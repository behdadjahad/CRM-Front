import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import ClientInfoCard, { ClientInfoCardInterface } from "./client-info-card";
import { useEffect, useMemo, useState } from "react";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCustomerData,
  addMultipleCustomerData,
  getAllCustomers,
  getCustomers,
} from "@/api/customer";
import { useParams } from "next/navigation";
import Image from "next/image";
import CustomerManager from "./customer-manager";

export interface ClientInfoContainerInterface {
  clients: ClientInfoCardInterface[];
}

export default function ClientInfoContainer() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [openThirdModal, setOpenThirdModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [clientList, setClientList] = useState<any[]>([]);
  const [clientInfoList, setClientInfoList] = useState<any[]>([]);
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
      //birthdate: ,
      idNumber: formik.values.clientSSD,
      phoneNumber: formik.values.clientPhoneNumber,
      email: formik.values.clientEmail,
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
        // email: customer?.email[0]?.email,
        //   phone: customer?.phone[0]?.number,
        email: "alirezaRezaei@gmail.com",
        phone: "989127359952",
      }));
      console.log(allCustomers?.data[0].phone[0].number);
      console.log(customersData);
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

  const { data: contractCustomersData } = useQuery({
    queryKey: ["contractCustomersData"],
    queryFn: () => getCustomers(Number(id)),
  });

  useEffect(() => {
    if (contractCustomersData) {
      const clients = contractCustomersData?.data?.map((client: any) => [
        { label: "id", value: client?.id },
        {
          label: "نام و نام خانوادگی",
          value: client?.customer?.person?.fullName,
        },
        { label: "کدملی", value: client?.customer?.person?.idNumber },
        { label: "شماره تلفن", value: client?.customer?.phone[0]?.number },
        { label: "ایمیل", value: client?.customer?.email[0]?.email },
      ]);
      console.log(contractCustomersData?.data);
      const clientsInfo = contractCustomersData?.data?.map((client: any) => ({
        id: client?.id,
        name: client?.customer?.person?.firstName,
        family: client?.customer?.person?.lastName,
        ssd: client?.customer?.person?.idNumber,
        phone: client?.customer?.phone[0]?.number,
        email: client?.customer?.email[0]?.email,
      }));
      console.log(129, clients);
      console.log(clientsInfo);
      setClientList(clients);
      setClientInfoList(clientsInfo);
    }
  }, [contractCustomersData]);

  const checkCustomerHandler = (customer: any, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCustomers((prevState) => [...prevState, customer]);
    } else {
      setSelectedCustomers((prevState) =>
        prevState.filter((item) => item.id !== customer.id)
      );
    }
  };
  const { mutate: submitMultipleCustomerHandler } = useMutation({
    mutationFn: (data: any) => {
      return addMultipleCustomerData(data, Number(id));
    },
    onSuccess: () => {
      setOpenSecondModal(false);
      setOpenThirdModal(false);
      setSelectedCustomers([]);
      queryClient.invalidateQueries({
        queryKey: ["contractCustomersData"],
      });
    },
  });
  function submitMultipleHandler(data: any) {
    const updatedData = data.map((obj: any) => obj.id);
    submitMultipleCustomerHandler(updatedData);
  }
  return (
    <div className="bg-card p-4 rounded-lg overflow-hidden flex flex-col gap-4">
      <h2 className="text-foreground text-lg">اطلاعات مشتری</h2>
      <div className="flex flex-col gap-4">
        {clientList.map((item, index) => (
          <ClientInfoCard
            key={`client-${index}`}
            clientId={item[0].value}
            clientData={item}
            clientInfo={clientInfoList[index]}
          />
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
        <Button
          variant={"foreground"}
          onClick={() => setOpenThirdModal(true)}
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
                setSelectedCustomers([]);
              }}
              className="cursor-pointer"
            />
          </div>

          <CustomerManager onCheckHandler={checkCustomerHandler} />

          <div className="flex flex-row gap-4 items-center justify-end">
            <Button
              variant={"info"}
              onClick={() => {
                submitMultipleHandler(selectedCustomers);
              }}
            >
              ثبت
            </Button>
            <Button
              variant={"foreground"}
              onClick={() => {
                setOpenThirdModal(false);
                setSelectedCustomers([]);
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

              <CustomerManager onCheckHandler={checkCustomerHandler} />

              <div className="flex flex-row gap-4 items-center justify-end">
                <Button
                  variant={"info"}
                  onClick={() => {
                    submitMultipleHandler(selectedCustomers);
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
                        {highlightMatch(customer.ssd, formik.values.clientSSD)}
                      </span>
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
    </div>
  );
}
