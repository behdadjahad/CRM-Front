import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import ServiceCustomerContainer from "./service-customer-container";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCustomersData } from "@/api/customer";
export default function ServiceCustomerManager() {
  const [openModal, setOpenModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);

  const { id } = useParams();

  const { data: contractCustomersData } = useQuery({
    queryKey: ["contractCustomersData"],
    queryFn: () => getCustomersData(Number(id)),
  });
  useEffect(() => {
    if (contractCustomersData) {
      console.log(22, contractCustomersData);
      const customerList = contractCustomersData?.data?.map((item: any) => ({
        id: item?.id,
        firstName: item?.person?.firstName,
        idNumber: item?.person?.idNumber,
        job: item?.person?.personJobs?.[0]?.jobs?.name,
        lastName: item?.person?.lastName,
        phone: item?.Communication?.mobile?.[0]?.communicationDetails,
        email: item?.Communication?.email?.[0]?.communicationDetails,
      }));

      setCustomers(customerList);
    }
  }, [contractCustomersData]);
  function submitServiceCustomer(customerId: number, checked: boolean) {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) =>
        prev.filter((item: number) => item !== customerId)
      );
    }
  }
  function submitHandler() {
    console.log(selectedCustomers);
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
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="لیست مشتری ها"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">لیست مشتری ها</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <ServiceCustomerContainer
          list={customers}
          onCheckCustomerHandler={submitServiceCustomer}
        />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              submitHandler();
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
    </div>
  );
}
