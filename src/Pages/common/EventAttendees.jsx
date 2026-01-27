import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../Services/api";

const EventAttendees = ({ eventId }) => {
  const { role, token } = useSelector((state) => state.auth);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/event/${eventId}/attendees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendees(res.data.attendees);
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
      <h3 className="text-xl font-semibold mt-8 mb-4">
        Attendees ({attendees.length})
      </h3>

      {loading ? (
        <p>Loading attendees...</p>
      ) : attendees.length === 0 ? (
        <p className="text-gray-500">No attendees yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Tickets</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Booked At</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.bookingId} className="border-t">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="flex shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            attendee.profileImage
                              ? attendee.profileImage
                              : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
                          }
                          alt="User"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attendee?.name || "User Name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attendee?.email || "User Email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2">{attendee.tickets}</td>
                  <td className="px-4 py-2">₹{attendee.totalAmount}</td>
                  <td className="px-4 py-2">
                    {new Date(attendee.bookedAt).toLocaleString()}
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

export default EventAttendees;
