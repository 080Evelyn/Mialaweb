import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveriesByState } from "@/redux/deliveriesByState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useNavigate } from "react-router";

const colors = [
  "#9F9FF8",
  "#96E2D6",
  "#000000",
  "#92BFFF",
  "#AEC7ED",
  "#94E9B8",
  "#F7B267",
  "#A7D2CB",
  "#E5989B",
  "#6D6875",
  "#B5EAEA",
  "#FBC4AB",
  "#CCD5AE",
  "#D5AAFF",
];

const RevenueBarChart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const stats = useSelector(
    (state) => state.deliveryByStateCount.deliveriesByState
  );

  useEffect(() => {
    dispatch(fetchDeliveriesByState({ token, userRole, navigate }));
  }, [dispatch, token, userRole]);

  //  Transform backend data to recharts format
  const chartData = useMemo(() => {
    if (!stats || stats.length === 0) return [];
    return stats.map((item, index) => ({
      name: item.state,
      value: item.totalDeliveries,
      color: colors[index % colors.length], // cycle colors
    }));
  }, [stats]);

  return (
    <div className="p-4 rounded-2xl bg-[#F9F9FA] w-full">
      <span className="font-semibold text-sm text-[#1C1C1C]">
        Total Deliveries by State
      </span>

      <ResponsiveContainer width="100%" height={200} className="mt-3">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 15, left: -25, bottom: 10 }}>
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
            className="text-sm text-black/40"
            tickFormatter={(value) => (value === 0 ? "0" : `${value}`)}
          />
          <Tooltip
            cursor={false}
            formatter={(value) => [`${value} Deliveries`, ""]}
            labelFormatter={(label) => `State: ${label}`}
          />
          <Bar dataKey="value" barSize={25} radius={[8, 8, 8, 8]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;
