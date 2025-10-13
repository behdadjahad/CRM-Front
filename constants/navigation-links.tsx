import { NavLinkInterface } from "@/components/shared/nav-link";
import Image from "next/image";

export const drawerLinks: { category: string; links: NavLinkInterface[] }[] = [
  {
    category: "خانه",
    links: [
      // {
      //   label: "قرارداد جدید",
      //   link: "/sale",
      //   icon: (
      //     <Image
      //       src={"/icons/file-add.png"}
      //       alt="قرارداد جدید"
      //       width={22}
      //       height={22}
      //     />
      //   ),
      // },
      // {
      //   label: "کاربر",
      //   link: "/user",
      //   icon: (
      //     <Image src={"/icons/user.png"} alt="کاربر" width={22} height={22} />
      //   ),
      // },
      // {
      //   label: "کارگزار",
      //   link: "/broker",
      //   icon: (
      //     <Image
      //       src={"/icons/user-dollar.png"}
      //       alt="کارگزار"
      //       width={22}
      //       height={22}
      //     />
      //   ),
      // },
      {
        label: "مشتری",
        link: "/customer",
        icon: (
          <Image
            src={"/icons/users.png"}
            alt="مشتری"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      {
        label: "درخواست ها",
        link: "/lead",
        icon: (
          <Image
            src={"/icons/lead-icon.png"}
            alt="درخواست"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      {
        label: "پکیج ها",
        link: "/packages",
        icon: (
          <Image
            src={"/icons/menu-package-icon.svg"}
            alt="پکیج ها"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      // {
      //   label: "خرید فیچرهای تکی",
      //   link: "/single-features",
      //   icon: (
      //     <Image
      //       src={"/icons/menu-package-icon.svg"}
      //       alt="خرید فیچرهای تکی"
      //       width={1024}
      //       height={1024}
      //       className="w-6 h-6"
      //     />
      //   ),
      // },
      {
        label: "فاکتورها",
        link: "/invoice",
        icon: (
          <Image
            src={"/icons/menu-invoice-icon.svg"}
            alt="فاکتورها"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      {
        label: "گزارش ها",
        link: "/report",
        icon: (
          <Image
            src={"/icons/report-menu-icon.png"}
            alt="گزارش ها"
            width={1024}
            height={1024}
            className="w-5.5 h-5.5"
          />
        ),
      },
      // {
      //   label: "فروش",
      //   link: "/sale",
      //   icon: (
      //     <Image
      //       src={"/icons/report.png"}
      //       alt="فروش"
      //       width={22}
      //       height={22}
      //     />
      //   ),
      // },
      {
        label: "قرارداد ها",
        link: "/contracts",
        icon: (
          <Image
            src={"/icons/document.png"}
            alt="قرارداد ها"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },

    ],
  },
  {
    category: "تنظیمات",
    links: [
      {
        label: "تنظیمات",
        link: "",
        icon: (
          <Image
            src={"/icons/setting.png"}
            alt="تنظیمات"
            width={22}
            height={22}
          />
        ),
        subMenu: [
          {
            label: "فرودگاه",
            link: "/setting/airport",
          },
          {
            label: "هتل",
            link: "/setting/hotel",
          },
          {
            label: "ایرلاین",
            link: "/setting/airline",
          },
        ],
      },
    ],
  },
];

// Cart-specific navigation links (minimal, no authentication required)
export const cartDrawerLinks: { category: string; links: NavLinkInterface[] }[] = [
  {
    category: "خرید",
    links: [
      {
        label: "بازگشت به فیچرها",
        link: "/single-features",
        icon: (
          <Image
            src={"/icons/menu-package-icon.svg"}
            alt="فیچرها"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      {
        label: "سبد خرید",
        link: "/cart",
        icon: (
          <Image
            src={"/icons/menu-invoice-icon.svg"}
            alt="سبد خرید"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
    ],
  },
];