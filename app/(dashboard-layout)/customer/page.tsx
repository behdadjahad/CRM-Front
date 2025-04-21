import CustomerTabContainer from "@/components/customer/customer-tab-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Customer() {
  return (
    <main>
 
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


        <CustomerTabContainer
          tabList={[
            "همه مشتری ها",
            "امروز",
            "5روز آینده",
            "گذشته و رسیدگی نشده",
          ]}
        />
     
    </main>
  );
}
