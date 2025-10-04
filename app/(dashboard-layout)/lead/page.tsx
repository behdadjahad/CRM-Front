import LeadContainer from "@/components/lead/LeadContainer";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Lead() {
  return (
    <main className="flex flex-col">
      <Title label="درخواست ها" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "درخواست ها",
          },
        ]}
      />

      <LeadContainer />
    </main>
  );
}
