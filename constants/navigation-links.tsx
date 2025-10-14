import { NavLinkInterface } from "@/components/shared/nav-link";
import Image from "next/image";
import { Calendar1, CalendarFold, CalendarFoldIcon } from "lucide-react";
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
        badge: "۵",
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
        badge: "۵",
        subMenu: [
          {
            id: "new-customer",
            label: "مشتری جدید",
            link: "/customer/new",
          },
          {
            id: "customer-list",
            label: "لیست مشتری ها",
            link: "/customer",
          },
        ],
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
        badge: "۵",
      },
      {
        id: "calendar",
        label: "رویدادها",
        link: "/calendar",
        icon: (
          <CalendarFoldIcon
          className="w-6 text-gray-600 h-6"
          />
        ),
      },
      {
        id: "purchase",
        label: "خرید",
        link: "/purchase",
        icon: (
          <Image
            src={"/icons/menu-package-icon.svg"}
            alt="خرید"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
        subMenu: [
          {
            id: "package-sub",
            label: "پکیج",
            link: "/packages",
          },
          {
            id: "feature-sub",
            label: "فیچر",
            link: "/single-features",
          },
        ],
      },
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
        badge: "۲",
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