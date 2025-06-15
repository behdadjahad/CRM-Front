import { cn } from "@/lib/utils";
import Image from "next/image";
import NotificationDrawer from "./notification-drawer";
import { useState } from "react";
import { NotificationCardInterface } from "../notification/notification-card";
const notificationList: NotificationCardInterface[] = [
  {
    id: 1,
    heading: "ویژگی جدید اضافه شد",
    user: {
      name: "",
      image: "",
      isOnline: false,
    },
    content:
      "خوشحالیم که نسخه به‌روزشده و بهتر تجربه ساخت قالب رو به شما معرفی کنیم.",
    button: {
      className: "",
      title: "الان امتحان کن",
      variant: "info",
    },
    icon: "",
    review: "",
    time: "2 دقیقه پیش",
    className: "",
    hasResponse: true,
  },
  {
    id: 2,
    heading: "",
    user: {
      name: "",
      image: "",
      isOnline: true,
    },
    content: "قرارداد جدید از شرکت سیمرغ پرواز ثبت شد و در حال بررسی است.",
    button: {
      className: "",
      title: "الان امتحان کن",
      variant: "info",
    },
    icon: "",
    review: "",
    time: "9 اردیبهشت",
    className: "",
    hasResponse: false,
  },
];
export const tabList = [
  { label: "همه اعلان ها", value: "all", count: 5 },
  { label: "خوانده نشده ها", value: "unread", count: 1 },
  { label: "خوانده شده ها", value: "read", count: 2 },
  { label: "رد شده", value: "decline", count: 2 },
];

export interface NotificationInterface {
  unread: boolean;
  className?: string;
}

export default function Notification({
  unread,
  className,
}: NotificationInterface) {
  const [openNotification, setOpenNotification] = useState(false);
  return (
    <div
      className={cn(
        "bg-badge p-2 rounded-lg flex flex-row items-center justify-center gap-3 outline-none h-10 w-10",
        className
      )}
    >
      <div className="relative">
        {unread ? (
          <span className="p-1 bg-destructive rounded-full w-2 h-2 absolute top-0 right-0"></span>
        ) : (
          <></>
        )}
        <Image
          src={"/icons/notification.png"}
          alt="notification"
          width={22}
          height={22}
          onClick={() => setOpenNotification(true)}
          className="cursor-pointer"
        />
      </div>
      <NotificationDrawer
        setState={setOpenNotification}
        state={openNotification}
   
        list={notificationList}
      />
    </div>
  );
}
