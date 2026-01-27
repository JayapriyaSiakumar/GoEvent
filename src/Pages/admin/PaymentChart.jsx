// components/charts/PaymentLineChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PaymentChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Payment Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="paid" />
          <Line type="monotone" dataKey="pending" />
          <Line type="monotone" dataKey="refunded" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentChart;
