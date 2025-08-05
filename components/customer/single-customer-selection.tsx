import { useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import CustomerListSection from "../service/customer-list-section";

export default function SingleCustomerSelection() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        variant={"foreground"}
        onClick={() => {
          setOpenModal(true);
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

        <CustomerListSection onCheckCustomerhandler={undefined} />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button variant={"info"} onClick={() => {}}>
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
