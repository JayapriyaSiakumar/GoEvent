import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../Services/api";
import { ClipLoader } from "react-spinners";

const EventPayments = ({ eventId }) => {
  const { role, token } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/payment/event-payment/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log(res.data);
        setPayments(res.data.payments);
        setTotalRevenue(res.data.totalRevenue);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (role === "organizer" || role === "admin") fetchAttendees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h3 className="text-xl font-semibold mt-8 mb-4">Payments</h3>
      <p className="mb-3 font-medium">Total Revenue: ₹{totalRevenue}</p>
      {loading ? (
        <div className="flex h-[80vh] items-center justify-center text-lime-600">
          <ClipLoader color="#00897B" size="40px" />
        </div>
      ) : payments?.length === 0 ? (
        <p className="text-gray-500">No payments yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Tickets</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Payment Mode</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="flex shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            payment.profileImage
                              ? payment.profileImage
                              : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
                          }
                          alt="User"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment?.user?.name || "User Name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment?.user?.email || "User Email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2">{payment?.booking?.quantity}</td>
                  <td className="px-4 py-2">
                    ₹{payment?.booking?.totalAmount}
                  </td>
                  <td className="px-4 py-2">{payment?.paymentMethod}</td>
                  <td className="px-4 py-2">
                    <span className=" bg-rose-600 rounded-md text-white px-1.5 py-1 ">
                      {payment?.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(payment.paidAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventPayments;
