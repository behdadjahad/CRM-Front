import Image from "next/image";
import { Button } from "../ui/button";

import NotificationDropDown from "./notification-drop-down";
import Link from "next/link";
import { limitForDrawerNotifications, notificationStatus } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { readNotification } from "@/api/notification";
import { fetchAllNotifications, fetchDrawerNotifications } from "@/store/notification-slice";
import { useDispatch, useSelector } from "react-redux";
export interface NotificationCardInterface {
  id: number;
  heading: string;
  user: {
    name: string;
    image: string;
    isOnline: boolean;
  };
  content: string;
  button: {
    className: string;
    title: string;
    variant: any;
  };
  icon: string;
  review: string;
  time: string;
  className: string;
  hasResponse: boolean;
  status: string;
  link: string;
}

export default function NotificationCard({
  id,
  heading,
  user,
  content,
  button,
  icon,
  review,
  time,
  className,
  hasResponse,
  status,
  link,
}: NotificationCardInterface) {
  const dispatch = useDispatch<any>();
  const filters = useSelector((state: any) => state.notification.filters);
  const currentPage = useSelector((state: any) => state.notification.currentPage);
  const limit = useSelector((state: any) => state.notification.limit);
  const { mutate: readHandler } = useMutation({
    mutationFn: (itemId: number) => {
      return readNotification(itemId);
    },
    onSuccess: () => {
      dispatch(
        fetchDrawerNotifications({
          page: 1,
          limit: limitForDrawerNotifications,
          filters: filters,
        })
      );
      dispatch(
        fetchAllNotifications({
          page: currentPage,
          limit: limit,
          filters: filters,
        })
      );
    },
  });
  return (
    <Link href={link}>
      <div
        className={`border-b flex flex-row justify-between items-start gap-2 p-3 w-full ${
          status === notificationStatus.unread ? "bg-[#F2F4F7]" : ""
        }`}
        onClick={() => {
          readHandler(id);
        }}
      >
        <div className="flex flex-col justify-start gap-2">
          {/* <div className="text-xs text-foreground-mute min-w-fit">{time}</div> */}
          <div className="flex flex-row items-start gap-3">
            {/* <div className="h-12 min-w-12">
            <Image
              src={"/images/user-notification.jpg"}
              alt={"تصویر"}
              width={1024}
              height={1024}
              className="h-12 w-12 rounded-full"
            />
          </div> */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">{heading}</div>
              <div className="text-sm">{content}</div>
              {hasResponse && (
                <Button className="w-fit" variant={button.variant}>
                  {button.title}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-foreground-mute min-w-fit">{time}</div>
          {/* <div>
          <NotificationDropDown list={dropDownList} />
        </div> */}
        </div>
      </div>
    </Link>
  );
}
