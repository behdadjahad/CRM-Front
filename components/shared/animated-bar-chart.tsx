import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-6 py-1 rounded text-sm shadow">
        {payload[0].value}
      </div>
    );
  }

  return null;
};
const AnimatedBar = forwardRef<SVGRectElement, any>(
  ({ x, y, width, height, fill }, ref) => {
    if (x == null || y == null || width <= 0 || height <= 0) return null;

    return (
      <motion.rect
        ref={ref}
        initial={{ y: y + height, height: 0 }}
        animate={{ y, height }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        x={x}
        width={width}
        height={height}
        fill={fill}
        pointerEvents="none"
      />
    );
  }
);

const AnimatedBarChart = ({ data, fill }: { data: any; fill: string }) => {
  return (
    <div className="w-full min-h-96 bg-card rounded-lg p-6 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          barCategoryGap="20%"
          barSize={15}
        >
          <CartesianGrid
            stroke="#94a3b8"
            strokeWidth={1} // Stroke thickness
            strokeDasharray="1 2"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            interval={0}
            tick={{ fontSize: 12 }}
            tickLine={false}
            strokeWidth={1}
          />
          <YAxis
            tick={{ fontSize: 12, dx: -15 }}
            tickLine={false}
            domain={[0, 350]}
            tickCount={8}
            strokeWidth={1}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="value" fill={fill} shape={<AnimatedBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
AnimatedBar.displayName = "AnimatedBar";
export default AnimatedBarChart;
