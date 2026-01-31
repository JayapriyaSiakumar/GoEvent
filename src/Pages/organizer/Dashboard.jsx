import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Sidebar from "../../Components/sidebar/Sidebar";
import PaymentChart from "../admin/PaymentChart";
import RevenueChart from "../admin/RevenueChart";
import api from "../../Services/api";

const AnalyticsStatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800">
    <div className="flex justify-between items-center">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {label}
      </p>
      <span className="text-xs text-teal-600 dark:text-indigo-400 bg-teal-100 dark:bg-indigo-500/20 px-2 py-1 rounded-md">
        LIVE
      </span>
    </div>

    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
      {value ?? 0}
    </p>

    <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
      <span>▲</span>
      <span>Trending</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [paymentChart, setPaymentChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const headers = { Authorization: `Bearer ${token}` };

      const [stats, payment, revenue] = await Promise.all([
        api.get("/dashboard/stats", { headers }),
        api.get("/dashboard/payments-chart", { headers }),
        api.get("/dashboard/revenue-chart", { headers }),
      ]);

      setDashboardData(stats.data.data);
      setPaymentChart(payment.data.data);
      setRevenueChart(revenue.data.data);
    } catch (err) {
      toast.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="p-6 mt-14 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Analytics Dashboard
        </h1>

        {/* Stats Section */}
        {!loading && dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AnalyticsStatCard
              label="Total Events"
              value={dashboardData.totalEvents}
            />
            <AnalyticsStatCard
              label="Total Attendees"
              value={dashboardData.totalAttendees}
            />
            <AnalyticsStatCard
              label="Total Registrations"
              value={dashboardData.totalRegistrations}
            />
            <AnalyticsStatCard
              label="Total Revenue"
              value={dashboardData.totalRevenue}
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900  border border-gray-100 dark:border-gray-800 rounded-xl">
            {/* <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Payment Analytics
            </h2> */}
            <PaymentChart data={paymentChart} />
          </div>

          <div className="bg-white dark:bg-gray-900  border border-gray-100 dark:border-gray-800 rounded-xl">
            {/* <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Revenue Analytics
            </h2> */}
            <RevenueChart data={revenueChart} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
