import { NavLinkInterface } from "@/components/shared/nav-link";
import Image from "next/image";

export const drawerLinks: { category: string; links: NavLinkInterface[] }[] = [
  {
    category: "خانه",
    links: [
      {
        label: "قرارداد جدید",
        link: "/",
        icon: (
          <Image
            src={"/icons/file-add.png"}
            alt="قرارداد جدید"
            width={22}
            height={22}
          />
        ),
      },
      {
        label: "کاربر",
        link: "/user",
        icon: (
          <Image src={"/icons/user.png"} alt="کاربر" width={22} height={22} />
        ),
      },
      {
        label: "کارگزار",
        link: "/broker",
        icon: (
          <Image
            src={"/icons/user-dollar.png"}
            alt="کارگزار"
            width={22}
            height={22}
          />
        ),
      },
      {
        label: "مشتری",
        link: "/customer",
        icon: (
          <Image src={"/icons/users.png"} alt="مشتری" width={22} height={22} />
        ),
      },
      {
        label: "گزارش ها",
        link: "/report",
        icon: (
          <Image
            src={"/icons/report.png"}
            alt="گزارش ها"
            width={22}
            height={22}
          />
        ),
      },
      {
        label: "قرارداد ها",
        link: "/contract",
        icon: (
          <Image
            src={"/icons/document.png"}
            alt="قرارداد ها"
            width={22}
            height={22}
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
        link: "/setting",
        icon: (
          <Image
            src={"/icons/setting.png"}
            alt="تنظیمات"
            width={22}
            height={22}
          />
        ),
      },
    ],
  },
];
