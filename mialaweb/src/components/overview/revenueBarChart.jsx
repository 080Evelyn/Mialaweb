import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", value: 25000, color: "#9F9FF8" },
  { name: "Feb", value: 18000, color: "#96E2D6" },
  { name: "Mar", value: 22000, color: "#000000" },
  { name: "Apr", value: 29000, color: "#92BFFF" },
  { name: "May", value: 14000, color: "#AEC7ED" },
  { name: "Jun", value: 31000, color: "#94E9B8" },
];

const RevenueBarChart = () => {
  return (
    <div className="p-4 rounded-2xl bg-[#F9F9FA] w-full">
      <span className="font-semibold text-sm text-[#1C1C1C]">Total Agents</span>

      <ResponsiveContainer width="100%" height={200} className="mt-3">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 15,
            left: -25,
            bottom: 10,
          }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            className="text-sm text-black/40"
            padding={{ left: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            ticks={[0, 10000, 20000, 30000]}
            tickFormatter={(value) => (value === 0 ? "0" : `${value / 1000}k`)}
            domain={[0, 30000]}
            className="text-sm text-black/40"
          />

          <Tooltip
            cursor={false}
            formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="value" barSize={25} radius={[8, 8, 8, 8]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;
