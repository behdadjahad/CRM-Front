import NotificationTabList, {
  NotificationTabInterface,
} from "./notification-tab-list";
const tabList = [
  { label: "همه اعلان ها", value: "all", count: 5 },
  { label: "خوانده نشده ها", value: "unread", count: 1 },
  { label: "خوانده شده ها", value: "read", count: 2 },
  { label: "رد شده", value: "decline", count: 2 },
];

interface NotificationHeaderInterface {
  title: string;
  list: NotificationTabInterface[];
  action: {
    title: string;
  };
}
export default function NotificationHeader({
  title,
  list,
  action,
}: NotificationHeaderInterface) {
  return (
    <div className="flex flex-col gap-4">
   
      <div className="flex justify-between p-3">
        {" "}
        <span className="font-bold text-base">{title}</span>
        <span className="text-primary-active teaxt-sm">{action.title}</span>
      </div>

      <NotificationTabList tabList={list} />
    </div>
  );
}
