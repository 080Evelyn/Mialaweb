import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Ajar", value: 52.1 },
  { name: "Saleko", value: 22.8 },
  { name: "Ijebu", value: 13.9 },
  { name: "Others", value: 11.2 },
];

const COLORS = ["url(#gradientAjar)", "#92BFFF", "#94E9B8", "#AEC7ED"];

const RevenuePieChart = () => {
  return (
    <div className="p-4 rounded-2xl bg-[#F9F9FA] w-full">
      <span className="font-semibold text-sm ">Revenue by Area</span>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <ResponsiveContainer width="100%" height={200} className="mt-4">
          <PieChart
            margin={{
              left: -15,
            }}
          >
            <defs>
              <linearGradient id="gradientAjar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="rgba(28, 28, 28, 0.6)" />
              </linearGradient>
            </defs>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={40}
              stroke="none"
              paddingAngle={4}
              cornerRadius={5}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-center ">
          {data.map((item, index) => (
            <div
              className="flex justify-between items-center w-full lg:ml-2"
              key={item.name}
            >
              <span className="flex items-center">
                {index === 0 ? (
                  <span className="inline-block w-2 h-2 mr-2 rounded-full bg-black" />
                ) : (
                  <span
                    className="inline-block w-2 h-2 mr-2 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                )}
                {item.name}
              </span>
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenuePieChart;
