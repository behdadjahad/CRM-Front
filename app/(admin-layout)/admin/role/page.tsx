import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Role() {
  return (
    <main>
      <Title label="نقش" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "نقش",
          },
        ]}
      />
    </main>
  );
}
