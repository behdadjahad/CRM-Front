import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { NotificationList } from "./notification-list";
import NotificationContainer from "../notification/notification-container";
import NotificationHeader from "../notification/notification-header";

import { NotificationCardInterface } from "../notification/notification-card";
const tabList = [
  { label: "همه اعلان ها", value: "all", count: 5 },
  { label: "خوانده نشده ها", value: "unread", count: 1 },
  { label: "خوانده شده ها", value: "read", count: 2 },
  { label: "رد شده", value: "decline", count: 2 },
];

export interface NotificationDrawerInterface {
  state: boolean;
  setState: (prev: boolean) => void;

  list: NotificationCardInterface[];
}
export const headerProps = {
  title: "اعلان ها",
  list: tabList,
  action: {
    title: "خوانده شدن همه",
  },
};
export default function NotificationDrawer({
  state,
  setState,
  list,
}: NotificationDrawerInterface) {
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
            <NotificationList list={list} />
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
