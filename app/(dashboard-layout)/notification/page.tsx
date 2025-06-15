import NotificationContainer from "@/components/notification/notification-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Notification() {
  return (
    <main>
      <div>
        <Title label="اعلان ها" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "اعلان ها",
            },
          ]}
        />
      </div>
      <NotificationContainer />
    </main>
  );
}
