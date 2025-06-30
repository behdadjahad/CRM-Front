import { useSelector } from "react-redux";
import NotificationTabList from "./notification-tab-list";

interface NotificationHeaderInterface {
  title: string;

  action: {
    title: string;
  };
}
export default function NotificationHeader({
  title,

  action,

}: NotificationHeaderInterface) {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between p-3">
        {" "}
        <span className="font-bold text-base">{title}</span>
        <span className="text-primary-active teaxt-sm">{action.title}</span>
      </div>


    </div>
  );
}
