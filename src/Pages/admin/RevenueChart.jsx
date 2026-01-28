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
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <h2 className="font-semibold mb-4">Revenue Chart</h2>
        <div className=" flex flex-col justify-center items-center gap-4  h-75">
          <h3 className="text-2xl">No Data Found</h3>
        </div>
      </div>
    );
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
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
