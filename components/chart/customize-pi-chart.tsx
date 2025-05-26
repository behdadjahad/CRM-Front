import { cn } from "@/lib/utils";
import { PieChart } from "react-minimal-pie-chart";

export function CustomizePiChart({
  data,
  className,
  legendClassName,
  labelFontSize,
}: {
  data: any[];
  className?: string;
  legendClassName?: string;
  labelFontSize?: string;
}) {
  return (
    <div className={cn(" w-full grid grid-cols-2 gap-4", className)}>
      <div className="h-36 col-span-1 flex items-center justify-center">
        <PieChart
          data={data}
          lineWidth={50}
          animate
          label={({ dataEntry }) =>
            dataEntry.value > 0 ? `${dataEntry.value}%` : ""
          }
          labelStyle={{
            fontSize: labelFontSize ? labelFontSize : "8px",
            fontWeight: "400",
            fill: "#000", // label color
          }}
          labelPosition={75}
        />
      </div>
      <div
        className={cn(
          "col-span-1 flex flex-col  justify-center items-end gap-1",
          legendClassName
        )}
      >
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-none"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-foreground-mute">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
