import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PieDataItem = {
  title: string;
  value: number;
  color: string;
};

export default function PieChartWithLegend({ data }: { data: PieDataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="title"
          outerRadius={75}
          innerRadius={30}
          stroke="none"
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="black"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight=""
              >
                {(percent * 100).toFixed(0)}%
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="left"
          verticalAlign="middle"
          iconType="square"
          iconSize={8}
          wrapperStyle={{
            fontSize: 8, // 👈 This adjusts the text size
            lineHeight: "24px",
            color: "black",
            // Optional: better spacing
          }}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
