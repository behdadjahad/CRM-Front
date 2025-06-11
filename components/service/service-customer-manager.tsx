import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import ServiceCustomerContainer from "./service-customer-container";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomersData } from "@/api/customer";
import { addServiceCustomerData } from "@/api/customer-service";
import { cn } from "@/lib/utils";
export default function ServiceCustomerManager({
  entityId,
  avService,
}: {
  entityId: number;
  avService: string;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: contractCustomersData } = useQuery({
    queryKey: ["contractCustomersData"],
    queryFn: () => getCustomersData(Number(id)),
  });
  useEffect(() => {
    if (contractCustomersData) {
  
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
  const { mutate: submitCustomerService } = useMutation({
    mutationFn: (data: any) => {
      return addServiceCustomerData(data, Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submittedVisa"] });
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
      queryClient.invalidateQueries({ queryKey: ["submittedOthers"] });
      queryClient.invalidateQueries({ queryKey: ["submittedRooms"] });
    },
  });
  function submitHandler() {
    const data = {
      avService: avService,
      customerIds: selectedCustomers,

      entityId: entityId,
    };

    submitCustomerService(data);
  }
  return (
    <div className="flex items-center justify-end">
      <Button
        variant={"transparent"}
        className={cn("text-aqua-foreground flex justify-end w-full")}
        onClick={() => setOpenModal(true)}
      >
        <FaPlus />
        افزودن مشتری
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
              setOpenModal(false);
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
