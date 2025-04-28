import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export default function MultipleBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="تورداخلی" fill="#FFDA44" name="تورداخلی" barSize={30} />
        <Bar dataKey="تورخارجی" fill="#0095FF" name="تورخارجی" barSize={30} />
        <Line
          type="monotone"
          dataKey="trend"
          stroke="#FF5722"
          name="Trend Line"
          strokeWidth={2}
          strokeDasharray="5 5" // Dashed style here
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
