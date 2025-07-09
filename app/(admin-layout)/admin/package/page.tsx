
import { getPackage } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";

export default function Package() {
  const { data: packageData } = useQuery({
    queryKey: ["packageData"],
    queryFn: async () => await getPackage(),
  });
console.log(packageData)
  return <div>package</div>;
}
