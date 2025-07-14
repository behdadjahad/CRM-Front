import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Permission() {
  return (
    <main>
      <Title label="دسترسی" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "دسترسی",
          },
        ]}
      />
    </main>
  );
}
