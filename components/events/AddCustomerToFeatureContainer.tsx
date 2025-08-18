import { useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import CustomerListSection from "../service/customer-list-section";
import CustomerSubmitterContainer from "../service/customer-submitter-container";

import { CustomerDataInterface } from "../service/customer-infinite-card";
interface AddCustomerToLeadContainerInterface {
  onSendCustomerData: (values: CustomerDataInterface) => void;
  onSendSelectedCustomer: (customer: CustomerDataInterface) => void;
  multiSelect?: boolean;
}
export default function AddCustomerToFeatureContainer({
  onSendSelectedCustomer,
  onSendCustomerData,
  multiSelect,
}: AddCustomerToLeadContainerInterface) {
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>();
  return (
    <>
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
          setOpenSecondModal(true);
          //   queryClient.removeQueries({ queryKey: ["customersData"] });
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
            }}
            className="cursor-pointer"
          />
        </div>

        <CustomerListSection
          onSendSelectedCustomer={(customer: CustomerDataInterface) => {
            setCustomerData(customer);
          }}
          multiSelect={multiSelect}
        />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenSecondModal(false);
              if (customerData) onSendSelectedCustomer(customerData);
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenSecondModal(false);
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="لیست مشتری ها"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">افزودن مشتری</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>

        <CustomerSubmitterContainer
          onSendCustomerData={(data: CustomerDataInterface) => {
            setCustomerData(data);
          }}
        />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(false);
              onSendCustomerData(customerData);
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
    </>
  );
}
