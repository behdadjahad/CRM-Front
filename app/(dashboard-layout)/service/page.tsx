"use client";

import ClientInfoContainer, {
  ClientInfoContainerInterface,
} from "@/components/service/client-info-container";
import ContractExpenseContainer, {
  ExpenseContainerInterface,
} from "@/components/service/contract-expense-container";
import ContractInfoContainer, {
  ContractInfoInterface,
} from "@/components/shared/contract-info-container";
import ExpertInfoContainer, {
  ExpertInfoInterface,
} from "@/components/shared/expert-info-container";
import ServiceContainer, {
  ServiceContainerInterface,
} from "@/components/shared/service-container";
import Image from "next/image";
import ServiceForm, {
  ServiceFormInterface,
} from "@/components/shared/service-form";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  hotelInformationExtender,
  internationalFlightExtender,
  pickupExtender,
  visaExtender,
} from "@/constants/extendable-fields";
import { purchaseInfo, recorderInfo } from "@/constants/service-form-fields";
import { useFormik } from "formik";

export default function Service() {
  const {
    clientInfoProps,
    contractServices,
    expenses,
    expert,
    contractInfo,
    flightForm,
  } = getData();
  return (
    <main className="flex flex-col lg:flex-row">
      <div className=" flex flex-col w-full lg:w-3/4">
        <div className="rounded-lg">
          <ExpertInfoContainer {...expert} />
          <ContractInfoContainer {...contractInfo} />
        </div>

        <ServiceContainer {...contractServices} />
      </div>

      <div className="w-full lg:w-1/4 flex flex-col">
        <ContractExpenseContainer {...expenses} />
        <div className="mt-4">
          <ClientInfoContainer {...clientInfoProps} />
        </div>
      </div>
    </main>
  );
}

function getData() {
  const expert: ExpertInfoInterface = {
    list: [
      {
        label: "",
        value: "",
        children: (
          <Image
            src={"/images/expert.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-full w-full"
          />
        ),
      },
      {
        label: "نام و نام خانوادگی",
        value: "آرشام رضایی",
      },
      {
        label: "نام دپارتمان",
        value: "دپارتمان",
      },
      {
        label: "سمت",
        value: "کارشناس سرویس هتل",
      },
    ],
  };

  const contractInfo: ContractInfoInterface = {
    list: [
      {
        label: "ثبت کننده",
        value: "ماهان زارع",
      },
      {
        label: "تاریخ ثبت درخواست",
        value: "۱۴۰۱/۱۰/۱۲",
      },
      {
        label: "تاریخ قرارداد",
        value: "۱۴۰۳/۰۴/۲۳",
      },
      {
        label: "شماره قرارداد",
        value: "7042851799",
      },
      {
        label: "موضوع قرارداد",
        value: "تور داخلی",
      },
      {
        label: "موضوع قرارداد",
        value: "تور داخلی",
      },
      {
        label: "توضیحات",
        value: "",
      },
    ],
  };

  const clientInfoProps: ClientInfoContainerInterface = {
    clients: [
      {
        data: [
          {
            label: "مشتری",
            value: "شخصی",
          },
          {
            label: "نام ونام خانوادگی",
            value: "مهدی میرزایی",
          },
          {
            label: "تاریخ تولد",
            value: "۱۳۶۰/۰۸/۱۵",
          },
          {
            label: "کدملی",
            value: "۲۴۴۵۸۹۷۵۸۴",
          },
          {
            label: "شماره تماس",
            value: "۰۲۱-۳۸۷۵۴۶۸۰",
          },
          {
            label: "شهر",
            value: "شیراز",
          },
        ],
        action: [
          {
            icon: { src: "/icons/edit-primary.png", width: 16, height: 16 },
            click: () => console.log("clicked"),
          },
          {
            icon: { src: "/icons/trash.png", width: 20, height: 20 },
            click: () => console.log("clicked"),
          },
        ],
        clientServices: [
          {
            icon: "/icons/airport.png",
            iconClassName: "w-6 h-4",
          },
          {
            icon: "/icons/visa.png",
          },
        ],
      },
      {
        data: [
          {
            label: "مشتری",
            value: "شخصی",
          },
          {
            label: "نام ونام خانوادگی",
            value: "مهدی میرزایی",
          },
          {
            label: "تاریخ تولد",
            value: "۱۳۶۰/۰۸/۱۵",
          },
          {
            label: "کدملی",
            value: "۲۴۴۵۸۹۷۵۸۴",
          },
          {
            label: "شماره تماس",
            value: "۰۲۱-۳۸۷۵۴۶۸۰",
          },
          {
            label: "شهر",
            value: "شیراز",
          },
        ],
        action: [
          {
            icon: {
              src: "/icons/edit-primary.png",
              width: 16,
              height: 16,
            },
            click: () => console.log("clicked"),
          },
          {
            icon: {
              src: "/icons/trash.png",
              width: 20,
              height: 20,
            },
            click: () => console.log("clicked"),
          },
        ],
        clientServices: [
          {
            icon: "/icons/visa.png",
          },
        ],
      },
    ],
  };

  const hotelForm: ServiceFormInterface = {
    radioButton: [
      { label: "هتل", value: "hotel" },
      { label: "آپارتمان", value: "apartment" },
    ],
    formExtender: hotelInformationExtender,
    purchaseForm: {
      title: "خرید",
      formDetail: {
        form: useFormik({
          initialValues: {
            costPerNight: "",
            currency: "",
            broker: "",
          },
          onSubmit: async () => {},
        }),
        fields: purchaseInfo,
      },
    },

    recordForm: {
      title: "اطلاعات مشتری (اطلاعات ثبت کننده)",
      formDetail: {
        form: useFormik({
          initialValues: {
            Registrar: "",
            receptionist: "",
            explanation: "",
          },
          onSubmit: async () => {},
        }),
        fields: recorderInfo,
      },
    },
  };
  const flightForm: ServiceFormInterface = {
    radioButton: [
      { label: "یک طرفه", value: "oneWayFlight" },
      { label: "رفت و برگشت", value: "RoundTripFlight" },
      { label: "چندمسیره", value: "multiRouteFlight" },
    ],
    formExtender: internationalFlightExtender,
    purchaseForm: {
      title: "خرید",
      formDetail: {
        form: useFormik({
          initialValues: {
            costPerNight: "",
            currency: "",
            broker: "",
          },
          onSubmit: async () => {},
        }),
        fields: purchaseInfo,
      },
    },

    recordForm: {
      title: "اطلاعات مشتری (اطلاعات ثبت کننده)",
      formDetail: {
        form: useFormik({
          initialValues: {
            Registrar: "",
            receptionist: "",
            explanation: "",
          },
          onSubmit: async () => {},
        }),
        fields: recorderInfo,
      },
    },
  };
  const visaForm: ServiceFormInterface = {
    formExtender: visaExtender,

    recordForm: {
      title: "اطلاعات مشتری (اطلاعات ثبت کننده)",
      formDetail: {
        form: useFormik({
          initialValues: {
            Registrar: "",
            receptionist: "",
            explanation: "",
          },
          onSubmit: async () => {},
        }),
        fields: recorderInfo,
      },
    },
  };
  const pickupForm: ServiceFormInterface = {
    radioButton: [
      { label: "یک طرفه", value: "oneWayPickup" },
      { label: "رفت و برگشت", value: "RoundTripPickup" },
    ],
    formExtender: pickupExtender,

    recordForm: {
      title: "اطلاعات مشتری (اطلاعات ثبت کننده)",
      formDetail: {
        form: useFormik({
          initialValues: {
            Registrar: "",
            receptionist: "",
            explanation: "",
          },
          onSubmit: async () => {},
        }),
        fields: recorderInfo,
      },
    },
  };
  const contractServices: ServiceContainerInterface = {
    services: [
      {
        image: "/images/services/visa.png",
        title: "ویزا",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-visa.png",
        activeImage: "/images/services/success/success-visa.png",
        children: <ServiceForm {...visaForm} />,
      },
      {
        image: "/images/services/international-airport.png",
        title: "پرواز خارجی",
        isSelected: false,
        selectedImage:
          "/images/services/primary/primary-international-airport.png",
        activeImage:
          "/images/services/success/success-international-airport.png",
        children: <ServiceForm {...flightForm} />,
      },
      {
        image: "/images/services/airport.png",
        title: "پرواز داخلی",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-airport.png",
        activeImage: "/images/services/success/success-airport.png",
        children: <ServiceForm {...flightForm} />,
      },
      {
        image: "/images/services/suitcase.png",
        title: "تور داخلی",
        isSelected: true,
        selectedImage: "/images/services/primary/primary-suitcase.png",
        activeImage: "/images/services/success/success-suit-case.png",
      },
      {
        image: "/images/services/suitcase.png",
        title: "تور خارجی",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-suitcase.png",
        activeImage: "/images/services/success/success-suit-case.png",
      },
      {
        image: "/images/services/hotel.png",
        title: "هتل داخلی",
        isSelected: true,
        selectedImage: "/images/services/primary/primary-hotel.png",
        activeImage: "/images/services/success/success-hotel.png",
        children: <ServiceForm {...hotelForm} />,
      },
      {
        image: "/images/services/hotel.png",
        title: "هتل خارجی",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-hotel.png",
        activeImage: "/images/services/success/success-hotel.png",
        children: <ServiceForm {...hotelForm} />,
      },
      {
        image: "/images/services/train.png",
        title: "قطار",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-train.png",
        activeImage: "/images/services/success/success-train.png",
      },
      {
        image: "/images/services/bus.png",
        title: "اتوبوس",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-bus.png",
        activeImage: "/images/services/success/success-bus.png",
      },
      {
        image: "/images/services/car.png",
        title: "خودرو",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-car.png",
        activeImage: "/images/services/success/success-car.png",
      },
      {
        image: "/images/services/pipcup.png",
        title: "پیکاپ",
        isSelected: true,
        selectedImage: "/images/services/primary/primary-pickup.png",
        activeImage: "/images/services/success/success-pickup.png",
        children: <ServiceForm {...pickupForm} />,
      },
      {
        image: "/images/services/nature.png",
        title: "طبیعت",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-nature.png",
        activeImage: "/images/services/success/success-nature.png",
      },
      {
        image: "",
        title: "...",
        isSelected: false,
        selectedImage: "",
        activeImage: "",
      },
      {
        image: "/images/services/more.png",
        title: "سایر",
        isSelected: false,
        selectedImage: "/images/services/primary/primary-others.png",
        activeImage: "/images/services/success/success-others.png",
      },
    ],
    className: "bg-transparent",
  };

  const expenses: ExpenseContainerInterface = {
    expenseList: [
      {
        title: "هتل",
        icon: "/icons/hotel.png",
        expenseInfo: [
          {
            price: "60000000",
            pricePostFix: "ریال",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "دلار",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "یورو",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
        ],
      },
      {
        title: "ویزا",
        icon: "/icons/visa.png",
        expenseInfo: [
          {
            price: "60000000",
            pricePostFix: "ریال",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "دلار",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "یورو",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
        ],
      },
      {
        title: "پرواز",
        icon: "/icons/airport.png",
        expenseInfo: [
          {
            price: "60000000",
            pricePostFix: "ریال",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "دلار",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
          {
            price: "60000000",
            pricePostFix: "یورو",
            convertedPrice: "60000000",
            convertedPricePostFix: "$",
          },
        ],
      },
    ],
    overalExpense: {
      title: "کل",
      overalExpenseDetail: [
        {
          label: "هزینه",
          value: "60000000",
        },
        {
          label: "درآمد",
          value: "250000000",
          children: (
            <div
              className="flex items-center
            justify-between bg-card-mute
            rounded-lg p-2 flex-row mt-2"
            >
              <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                درآمد
              </span>
              <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                نرخ تبدیل
              </span>
              <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                دلار
              </span>
              <Button
                variant={"info"}
                className="p-1 border-none rounded-full w-4 h-4"
              >
                <FaPlus className="text-card" />
              </Button>
            </div>
          ),
        },
        {
          label: "سود و زیان",
          value: "50000000",
        },
      ],
    },
  };

  return {
    clientInfoProps,
    contractServices,
    expenses,
    expert,
    contractInfo,
    hotelForm,
    flightForm,
  };
}
