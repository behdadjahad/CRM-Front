import { useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import CustomerListSection from "../service/customer-list-section";
import CustomerSubmitterContainer from "../service/customer-submitter-container";
import { useFormik } from "formik";
interface AddCustomerToLeadContainerInterface {
  onSendCustomerData: (values: any) => void;
  onSendCustomer?:any;
}
export default function AddCustomerToLeadContainer({
  onSendCustomerData,
  onSendCustomer,
}: AddCustomerToLeadContainerInterface) {
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      clientName: "",
      clientFamily: "",
      clientSSD: "",
      clientPhoneNumber: "",
      clientEmail: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
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

        <CustomerListSection onSendCustomer={onSendCustomer} />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button variant={"info"} onClick={() => {}}>
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

        <CustomerSubmitterContainer formik={formik} />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(false);
              onSendCustomerData(formik.values);
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
