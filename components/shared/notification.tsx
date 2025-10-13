import { cn } from "@/lib/utils";
import Image from "next/image";
import NotificationDrawer from "./notification-drawer";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";


export interface NotificationInterface {
  unread: boolean;
  className?: string;
}

export default function Notification({
  unread,
  className,
}: NotificationInterface) {
  const [openNotification, setOpenNotification] = useState(false);
  const { count, isConnected } = useNotifications();

  // Use SSE count if available, otherwise fall back to prop
  const hasUnreadNotifications = count > 0 || unread;

  return (
    <div
      className={cn(
        "bg-badge p-2 rounded-lg flex flex-row items-center justify-center gap-3 outline-none h-10 w-10",
        className
      )}
    >
      <div className="relative">
        {hasUnreadNotifications && (
          <span className="p-1 bg-destructive rounded-full w-2 h-2 absolute top-0 right-0"></span>
        )}
        <Image
          src={"/icons/notification.png"}
          alt="notification"
          width={22}
          height={22}
          onClick={() => setOpenNotification(true)}
          className="cursor-pointer"
        />

        {/* Show count badge if count > 0 */}
        {count > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </div>
        )}
      </div>
      <NotificationDrawer
        setState={setOpenNotification}
        state={openNotification}
      />
    </div>
  );
}
