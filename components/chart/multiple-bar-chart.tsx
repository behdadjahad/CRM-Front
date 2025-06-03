import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
} from "recharts";

export default function MultipleBarChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data?.list}>
        {/* <BarChart data={data.list}> */}
        <XAxis
          dataKey="month"
          interval={0}
          tick={{ fontSize: 12 }}
          tickLine={false}
          strokeWidth={1}
        />
        <YAxis
          tick={{ fontSize: 12, dx: -50 }}
          tickLine={false}
          domain={[0, 1000000000]}
          tickCount={10}
          strokeWidth={1}
        />
        {/* <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;

            // Only render bar entries based on a safer condition
            const barPayload = payload.filter((entry) => {
              // Option A: If you know each bar has a unique `name` or `fill`, filter on that
              // Option B (better): Compare against your known series keys
              return data.chartSeries.some((s: any) => s.key === entry.dataKey);
            });

            return (
              <div
                style={{
                  backgroundColor: "black",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "white",
                }}
              >
                {barPayload.map((entry, idx) => (
                  <div key={idx}>{entry.value}</div>
                ))}
              </div>
            );
          }}
        /> */}
        <Legend />
        {data?.chartSeries?.map((item: any) => (
          <Line
            key={`line${item.key}`}
            type="linear"
            dataKey={item.key}
            stroke={item.fill}
            legendType="none"
            hide={false}
            dot={({ cx = 0, cy = 0 }) => (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="white"
                stroke={item.fill}
                strokeWidth={1}
                pointerEvents="none" // 👈 disables hover so it doesn't trigger tooltip
              />
            )}
            activeDot={false}
          />
        ))}
        {data?.chartSeries.map((item: any, index: number) => (
          <Tooltip
            key={`tooltip-${item.key}-${index}`}
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              // Only show tooltip for the bar that's actually hovered
              // Recharts often gives both bars — we want only the one under the cursor
              const hoveredBarEntry = payload.find((entry) => {
                return (
                  entry.dataKey && entry.payload[entry.dataKey] === entry.value
                );
              });

              if (!hoveredBarEntry) return null;

              const { dataKey, value } = hoveredBarEntry;

              const seriesMeta = data.chartSeries.find(
                (s: any) => s.key === dataKey
              );
              const label = seriesMeta?.label ?? dataKey;
              const color = seriesMeta?.fill ?? "black";

              return (
                <div
                  style={{
                    backgroundColor: color,
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    pointerEvents: "none",
                  }}
                >
                  {label}: {value?.toLocaleString()}
                </div>
              );
            }}
          />
        ))}
        {data?.chartSeries?.map((item: any) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={item.fill}
            name={item.label}
            barSize={8}
          />
        ))}

        <CartesianGrid
          stroke="#94a3b8"
          strokeWidth={1} // Stroke thickness
          strokeDasharray="1 2"
          vertical={false}
        />
        {/* {data.chartSeries.map((item: any, index: number) => (
          <Tooltip
            key={`tooltip-${item.key}-${index}`}
            cursor={false}
            content={({ active, payload }) => {
              return (
                <div
                  style={{
                    backgroundColor: index === 0 ? "black":"red",
                    color:"white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    pointerEvents: "none",
                  }}
                >{item.label}</div>
              );
            }}
          />
        ))} */}
        {/* </BarChart> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
