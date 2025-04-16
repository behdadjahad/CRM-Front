import CustomerTabContainer from "@/components/customer/customer-tab-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Customer() {
  return (
    <main>
      <div>
        <Title label="مشتری" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "مشتری",
            },
          ]}
        />
      </div>
      <div className="bg-card h-full rounded-lg">
        <CustomerTabContainer
          tabList={[
            "همه مشتری ها",
            "امروز",
            "5روز آینده",
            "گذشته و رسیدگی نشده",
          ]}
        />
      </div>
    </main>
  );
}
