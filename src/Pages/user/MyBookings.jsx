import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMyBookings,
  cancelBookingSuccess,
} from "../../Redux/Features/bookingSlice";
import api from "../../Services/api";
import { formatDateTimeLocal } from "../../Utils/date";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { bookings } = useSelector((state) => state.bookings);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async (token) => {
    setLoading(true);
    const { data } = await api.get("/bookings/my-bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const cancelBookingApi = async (id, token) => {
    const { data } = await api.put(
      `/bookings/cancel/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings(token);
        dispatch(setMyBookings(data));
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load booking");
      }
    };
    loadBookings();
  }, [dispatch, token]);

  const cancelHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      const response = await cancelBookingApi(id, token);
      toast.success(
        response.message || "Booking cancelled & refund initiated 💸",
      );
      dispatch(cancelBookingSuccess(id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lime-600">
        <ClipLoader color="#00897B" size="40px" />
      </div>
    );
  }

  return (
    <div className="p-4  mt-14 max-w-7xl mx-auto">
      <div className="p-6  min-h-screen ">
        <h2 className="text-2xl font-bold mb-3">My Bookings</h2>
        {bookings.length === 0 ? (
          <div className="flex justify-center items-center w-full">
            {" "}
            <h2 className="text-2xl font-bold text-gray-800">No Data Found.</h2>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className=" w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md"
                              src={
                                booking.event.bannerImage
                                  ? booking.event.bannerImage
                                  : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
                              }
                              alt="User"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking?.event.title || "Event Title"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTimeLocal(booking?.bookedAt) ||
                          "Booked Date"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.bookingStatus || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.quantity || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.totalAmount || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking?.paymentStatus || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingStatus === "confirmed" &&
                          booking.event.status === "published" && (
                            <button
                              onClick={() => cancelHandler(booking._id)}
                              className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
                              Cancel Booking
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
