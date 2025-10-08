import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import Image from "next/image";
import { FaLocationArrow, FaMapMarkerAlt, FaSnapchatGhost, FaTag, FaTags, FaThLarge, FaUser, FaUserAlt, FaUserAltSlash } from 'react-icons/fa';
import {
    Calendar,
    Clock,
    MapPin,
    Bell,
    Search,
    User,
    X,
    Phone,
    MessageSquare,
    Mail,
    Users,
    Headphones,
    CheckCircle,
    AlertCircle,
    ShieldCloseIcon,
    SettingsIcon,
    PersonStanding,
    PersonStandingIcon,
    User2,
    MenuIcon
} from 'lucide-react';
export interface EventCreationContainerInterface {
  trigger?: React.ReactElement;
}
export default function EventCreationContainer({
  trigger,
}: EventCreationContainerInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <>
      {trigger ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(true);
          }}
          className="cursor-pointer"
        >
          <div style={{ pointerEvents: "none" }}>{trigger}</div>
        </div>
      ) : (
        <></>
      )}
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-col gap-4">
          {" "}
          <div className="flex flex-row reverse w-full items-center justify-between">
            <span className="text-lg font-bold">افزودن رویداد</span>
            <MdClose
              size={20}
              onClick={() => {
                setOpenModal(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <FormMaker
            form={formik}
            fields={[
              {
                dependantKey: "startTimeType",
                outerIcon: <Clock className="w-5 h-5 text-[#B6BCC2]" />,
                key: "startTime",
                component: "date-time",
                placeholder: "تاریخ و زمان شروع",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                dependantKey: "endDateType",
                key: "endDate",
                component: "date-time",
                placeholder: "تاریخ و زمان پایان",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full pl-5  md:w-1/2",
              },
              {
                outerIcon: (
                  <FaTag stroke="white" className="w-5 h-5 text-[#B6BCC2]" />
                ),
                key: "temparetureInput",
                dependantKey: "temparetureType",
                component: "Select",
                placeholder: "میزان علاقه‌مندی",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full",
                // options: interestLevels.map((level) => ({
                //   label: level,
                //   value: level,
                // })),
              },
              {
                outerIcon: (
                  <FaMapMarkerAlt className="w-5 h-5 text-[#B6BCC2]" />
                ),
                key: "location",
                component: "input",
                placeholder: "مکان",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full",
              },
              {
                outerIcon: (
                  <MenuIcon className="w-5 h-5 self-start text-[#B6BCC2]" />
                ),
                key: "description",
                component: "textarea",
                placeholder: "متن توضیحات ",
                type: "text",
                floating: true,
                className: "w-full ",
              },
              {
                outerIcon: <User2 className="w-5 h-5 text-[#B6BCC2]" />,
                key: "followUpResponsible",
                component: "input",
                placeholder: "مسئول پیگیری",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full",
              },
              {
                dependantKey: "personSearchPreview",
                key: "personSearch",
                component: "search-input",
                placeholder: "جستجوی شخص",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full mr-8",
              },
              {
                key: "personSearchPreview",
                dependantKey: "person",
                component: "tag-preview",
                className: "w-full",
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
      </CustomModal>
    </>
  );
}
