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
        link: "/sale",
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
            link: "/setting/station",
          },
        ],
      },
    ],
  },
];
