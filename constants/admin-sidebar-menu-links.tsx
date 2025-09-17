import { NavLinkInterface } from "@/components/shared/nav-link";
import Image from "next/image";

export const adminSideBarMenuLinks: { category: string; links: NavLinkInterface[] }[] = [
  {
    category: "ادمین",
    links: [
      {
        label: "پکیج",
        link: "/admin/package",
        icon: (
          <Image
            src={"/icons/package-icon.png"}
            alt="پکیج"
            width={1024}
            height={1024}
            className="w-8 h-8"
          />
        ),
      },
      {
        label: "دسته بندی پکیج",
        link: "/admin/category",
        icon: (
          <Image
            src={"/icons/package-category-icon.png"}
            alt="دسته بندی پکیج"
            width={1024}
            height={1024}
            className="w-8 h-8"
          />
        ),
      },
      {
        label: " واحد پکیج",
        link: "/admin/package-unit",
        icon: (
          <Image
            src={"/icons/package-unit-icon.png"}
            alt="واحدپکیج"
            width={1024}
            height={1024}
             className="w-8 h-8"
          />
        ),
      },
      {
        label: "صفحه",
        link: "/admin/page",
        icon: (
          <Image
            src={"/icons/page-icon.png"}
            alt="صفحه"
            width={1024}
            height={1024}
             className="w-8 h-8"
          />
        ),
      },
      {
        label: "نقش",
        link: "/admin/role",
        icon: (
          <Image
            src={"/icons/role-icon.png"}
            alt="نقش"
            width={1024}
            height={1024}
             className="w-8 h-8"
          />
        ),
      },
      {
        label: "دسترسی",
        link: "/admin/permission",
        icon: (
          <Image
            src={"/icons/permission-icon.png"}
            alt="دسترسی"
            width={1024}
            height={1024}
             className="w-8 h-8"
          />
        ),
      },
      {
        label: "درخواست های خرید",
        link: "/admin/invoices",
        icon: (
          <Image
            src={"/icons/package-order-icon.svg"}
            alt="دسترسی"
            width={1024}
            height={1024}
             className="w-6 h-6"
          />
        ),
      },
      {
        label: "لیبل",
        link: "/admin/label",
        icon: (
          <Image
            src={"/icons/label-icon.svg"}
            alt="لیبل"
            width={1024}
            height={1024}
             className="w-8 h-8"
          />
        ),
      },
    
    ],
  },
  
];
