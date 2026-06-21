"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyBarChart({
  data,
}: {
  data: any[];
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="co2"
          fill="#16a34a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}