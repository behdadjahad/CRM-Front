import { cn, limitForNotifications, notificationStatus } from "@/lib/utils";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationList } from "./notification-list";

import NotificationHeader from "../notification/notification-header";

import { useDispatch, useSelector } from "react-redux";
import { fetchDrawerNotifications } from "@/store/notification-slice";
import NotificationTabList from "../notification/notification-tab-list";

export interface NotificationDrawerInterface {
  state: boolean;
  setState: (prev: boolean) => void;
}
export const headerProps = {
  title: "اعلان ها",

  action: {
    title: "خوانده شدن همه",
  },
};
export default function NotificationDrawer({
  state,
  setState,
}: NotificationDrawerInterface) {
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState(notificationStatus.all);
  useEffect(() => {
    const filters =
      activeTab === notificationStatus.all ? {} : { status: activeTab };
    dispatch(
      fetchDrawerNotifications({ page: 1, limit: limitForNotifications, filters })
    );
  }, [activeTab]);

  const notifications = useSelector(
    (state: any) => state.notification.drawerItems
  );
  const tabList = useSelector((state: any) => state.notification.tabList);
  return (
    <div
      className={cn("h-0 w-0 overflow-hidden top-0 left-0 z-50 fixed", {
        "w-screen h-screen": state,
      })}
    >
      <div
        className="bg-foreground/80 h-screen w-screen z-20"
        onClick={() => setState(false)}
      />
      <div
        className={cn(
          "h-screen rounded-r-2xl fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
          {
            "w-[440px]": state,
          }
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-2 p-3">
            <NotificationHeader {...headerProps} />
            <NotificationTabList tabList={tabList} onChangeTab={setActiveTab} activeTab={activeTab} />
            <NotificationList list={notifications} />
          </div>

          <Link
            className="text-center h-12 flex items-center justify-center text-[#2E70E8] border border-t font-primary-bold"
            href="/notification"
            onClick={() => setState(false)}
          >
            مشاهده همه
          </Link>
        </div>
      </div>
    </div>
  );
}
