import NotificationCard from "../notification/notification-card";
export function NotificationList({ list }: { list: any[] }) {
  return (
    <div className="w-full bg-card rounded-lg">
      {list.map((item) => (
        <NotificationCard key={item.id} {...item} />
      ))}
    </div>
  );
}
