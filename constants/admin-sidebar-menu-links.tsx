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
            src={"/icons/report-menu-icon.png"}
            alt="پکیج"
            width={1024}
            height={1024}
            className="w-6 h-6"
          />
        ),
      },
      {
        label: "دسته بندی پکیج",
        link: "/admin/category",
        icon: (
          <Image
            src={"/icons/report-menu-icon.png"}
            alt="دسته بندی پکیج"
            width={1024}
            height={1024}
            className="w-5.5 h-5.5"
          />
        ),
      },
      {
        label: " واحد پکیج",
        link: "/admin/unit-package",
        icon: (
          <Image
            src={"/icons/report-menu-icon.png"}
            alt="واحدپکیج"
            width={1024}
            height={1024}
            className="w-5.5 h-5.5"
          />
        ),
      },
    
    ],
  },
  
];
