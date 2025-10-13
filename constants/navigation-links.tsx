import { NavLinkInterface } from "@/components/shared/nav-link";
import Image from "next/image";

export const drawerLinks: { category?: string; links: NavLinkInterface[] }[] = [
  {
    category: "خانه",
    links: [
      {
        id: "contracts",
        label: "قراردادها",
        link: "/contracts",
        icon: (
          <Image
            src={"/icons/document.png"}
            alt="قراردادها"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
        subMenu: [
          {
            id: "new-contract",
            label: "قرارداد جدید",
            link: "/contracts/new",
          },
          {
            id: "contract-list",
            label: "لیست قرارداد ها",
            link: "/contracts",
          },
        ],
      },
      // {
      //   id: "purchase",
      //   label: "خرید",
      //   link: "/purchase",
      //   icon: (
      //     <Image
      //       src={"/icons/menu-package-icon.svg"}
      //       alt="خرید"
      //       width={1024}
      //       height={1024}
      //       className="w-6 h-6"
      //     />
      //   ),
      //   subMenu: [
      //     {
      //       id: "package-sub",
      //       label: "پکیج",
      //       link: "/packages",
      //     },
      //     {
      //       id: "feature-sub",
      //       label: "فیچر",
      //       link: "/single-features",
      //     },
      //   ],
      // },
      {
        id: "invoice-main",
        label: "صورتحساب",
        link: "/invoice",
        icon: (
          <Image
            src={"/icons/menu-invoice-icon.svg"}
            alt="صورتحساب"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
        badge: "۵",
      },
     
      // {
      //   id: "settings-with-icon",
      //   label: "تنظیمات",
      //   link: "/settings",
      //   icon: (
      //     <Image
      //       src={"/icons/setting.png"}
      //       alt="تنظیمات"
      //       width={1024}
      //       height={1024}
      //       className="w-6 h-6"
      //     />
      //   ),
      // },

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
        id: "customer",
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
        id: "lead",
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
        id: "packages",
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
        id: "invoice",
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
        id: "report",
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
      // {
      //   id: "contracts",
      //   label: "قرارداد ها",
      //   link: "/contracts",
      //   icon: (
      //     <Image
      //       src={"/icons/document.png"}
      //       alt="قرارداد ها"
      //       width={1024}
      //       height={1024}
      //       className="w-6 h-6"
      //     />
      //   ),
      // },

    ],
  },
  {
 
    links: [
      {
        id: "settings",
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
            id: "airport",
            label: "فرودگاه",
            link: "/setting/airport",
          },
          {
            id: "hotel",
            label: "هتل",
            link: "/setting/hotel",
          },
          {
            id: "airline",
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
        id: "single-features",
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
        id: "cart",
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