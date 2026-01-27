// components/charts/RevenueBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data }) => {
  if (data.length === 0)
    return (
      <div className="bg-white p-6 rounded-xl flex justify-center items-center text-2xl w-full">
        No Data Found
      </div>
    );
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Monthly Revenue</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
