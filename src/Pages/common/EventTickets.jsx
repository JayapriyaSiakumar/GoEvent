import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../Services/api";
import { ClipLoader } from "react-spinners";

const EventTickets = ({ eventId }) => {
  const { role, token } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/event/getEvent/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log(res.data);
        setTickets(res.data.ticketAvailability);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (role === "organizer" || role === "admin") fetchAttendees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateEventStatus = async (eventId, status) => {
    try {
      await api.patch(
        `/event/status/${eventId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Event Status Updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div className="flex justify-between w-full items-center">
        <h3 className="text-xl font-semibold mt-8 mb-4">Tickets</h3>
        <button
          type="button"
          className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md cursor-pointer"
          onClick={() => updateEventStatus(eventId, "sold-out")}>
          Set sold-out
        </button>
      </div>

      {loading ? (
        <div className="flex h-[80vh] items-center justify-center text-lime-600">
          <ClipLoader color="#00897B" size="40px" />
        </div>
      ) : tickets?.length === 0 ? (
        <p className="text-gray-500">No payments yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Ticket Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Total Tickets</th>
                <th className="px-4 py-2 text-left">Booked Tickets</th>
                <th className="px-4 py-2 text-left">Available Tickets</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t">
                  <td className="px-4 py-2">{ticket?.ticketType}</td>
                  <td className="px-4 py-2">₹{ticket?.price}</td>
                  <td className="px-4 py-2">{ticket?.totalTickets}</td>
                  <td className="px-4 py-2">{ticket?.bookedTickets}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-amber-500 text-white rounded-md">
                      {ticket?.availableTickets}
                    </span>
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

export default EventTickets;
