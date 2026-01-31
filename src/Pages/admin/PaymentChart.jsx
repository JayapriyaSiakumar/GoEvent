// components/charts/PaymentBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const PaymentChart = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <h2 className="font-semibold mb-4">Payment Chart</h2>
        <div className="flex flex-col justify-center items-center gap-4 h-75">
          <h3 className="text-2xl">No Data Found</h3>
        </div>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Payment Overview</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bars */}
          <Bar
            dataKey="paid"
            name="Paid"
            fill="#14B8A6"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="pending"
            name="Pending"
            fill="#F59E0B"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="refunded"
            name="Refunded"
            fill="#EF4444"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentChart;
