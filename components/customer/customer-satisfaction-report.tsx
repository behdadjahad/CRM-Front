import CustomerSatisfactionReportCard from "./customer-satisfaction-report-card";
import { PieChart } from "react-minimal-pie-chart";
export interface CustomerSatisfactionReportInterface {
  title: string;
  indicatorClassName: string;
  list: {
    label: string;
    value: number;
  }[];
}
interface CustomerSatisfactionReportProps {
  data: CustomerSatisfactionReportInterface[];
}

export default function CustomerSatisfactionReport({
  data,
}: CustomerSatisfactionReportProps) {
  const totalContracts = 120;
  const satisfaction = 80;
  const unsatisfaction = 40;
  return (
    <div className="bg-card rounded-lg custom-shadow p-6">
      <div className="grid grid-cols-2">
        <div className="flex flex-col justify-between">
          <div className="font-bold">رضایتمندی</div>
          <div className="flex items-center justify-center h-full">
            <div className="relative w-68 h-68">
              {" "}
              {/* width = 208px */}
              <PieChart
                data={[
                  {
                    title: "Satisfaction",
                    value: satisfaction,
                    color: "#1CB771",
                  },
                  {
                    title: "Unsatisfaction",
                    value: unsatisfaction,
                    color: "#D80027",
                  },
                ]}
                lineWidth={40} // donut thickness
                animate
                label={({ dataEntry }) => `${dataEntry.value}`}
                labelStyle={{
                  fontSize: "5px",

                  fill: "#000", // label color
                }}
                labelPosition={80}
              />
              {/* Centered Text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold">{totalContracts}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((item: CustomerSatisfactionReportInterface) => (
            <CustomerSatisfactionReportCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
