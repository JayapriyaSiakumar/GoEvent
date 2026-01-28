import React, { useEffect, useState } from "react";
import Events from "../../Components/Events";
import Sidebar from "../../Components/sidebar/Sidebar";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import api from "../../Services/api";
import PaymentChart from "../admin/PaymentChart";
import RevenueChart from "../admin/RevenueChart";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState();
  const [paymentChart, setPaymentChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const fetchData = async () => {
    try {
      const response = await api.get(`/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data.data);
      //toast.success("Dashboard Data Fetched Successfully");
    } catch (error) {
      toast.error("Something Went Wrong", error);
    }
  };

  const fetchPaymentChart = async () => {
    try {
      const response = await api.get(`/dashboard/payments-chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPaymentChart(response.data.data);
      //toast.success("Dashboard Data Fetched Successfully");
    } catch (error) {
      toast.error("Something Went Wrong", error);
    }
  };
  const fetchRevenueChart = async () => {
    try {
      const response = await api.get(`/dashboard/revenue-chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRevenueChart(response.data.data);
      //toast.success("Dashboard Data Fetched Successfully");
    } catch (error) {
      toast.error("Something Went Wrong", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPaymentChart();
    fetchRevenueChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Sidebar />
      <div className="p-4  mt-14">
        <div className="p-6  min-h-screen">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4">
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                    Total Events
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-teal-600 dark:text-indigo-400">
                    {dashboardData?.totalEvents || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                    Total Attendee
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-teal-600 dark:text-indigo-400">
                    {dashboardData?.totalAttendees || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                    Total Registration
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-teal-600 dark:text-indigo-400">
                    {dashboardData?.totalRegistrations || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
                    Total Revenue
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-teal-600 dark:text-indigo-400">
                    {dashboardData?.totalRevenue || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {/*  Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className=" p-2">
              {paymentChart && <PaymentChart data={paymentChart} />}
            </div>
            <div className=" p-2">
              {revenueChart && <RevenueChart data={revenueChart} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
