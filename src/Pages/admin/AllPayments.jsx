import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/dashboard/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(response.data.data);
        setLoading(false);
        //toast.success("Dashboard Data Fetched Successfully");
      } catch (error) {
        toast.error("Something Went Wrong", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lime-600">
        <ClipLoader color="#00897B" size="40" />
      </div>
    );
  }

  return (
    <div className="mt-14 p-10 w-full max-w-7xl">
      <h1 className="text-3xl font-bold mb-4">Payments</h1>
      {payments.length === 0 ? (
        <div className="flex justify-center items-center w-full h-2/3">
          {" "}
          <h2 className="text-xl font-bold text-gray-800">
            No Payments Found.
          </h2>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">{p.user?.name}</td>
                    <td className="p-3">{p.event?.title}</td>
                    <td className="p-3">₹ {p.totalAmount}</td>
                    <td className="p-3 capitalize">
                      <span className=" bg-rose-600 rounded-md text-white px-1.5 py-1 ">
                        {p?.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AllPayments;
