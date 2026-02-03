import React from "react";
import Sidebar from "../../Components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../stripe";
import CheckoutForm from "../user/CheckoutForm";
import api from "../../Services/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const EventOverview = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [ticketAvailability, setTicketAvailability] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const { role, token } = useSelector((state) => state.auth);
  /*  const [attendees, setAttendees] = useState([]);*/
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/event/getEvent/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data.event);
        setTicketAvailability(res.data.ticketAvailability);
        setLoading(false);
        //console.log(res);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchEvent();

    /* const fetchAttendees = async () => {
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
    if (role === "organizer" || role === "admin") fetchAttendees(); */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAvailableTickets = () => {
    if (!selectedTicket || !ticketAvailability) return 0;

    const res = ticketAvailability.find(
      (t) => t.ticketType === selectedTicket.ticketType,
    );

    return res?.availableTickets || 0;
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    const available = getAvailableTickets();

    if (value > available) {
      setError(`Only ${available} tickets available`);
      setQuantity(available); // auto-fix (optional UX)
    } else {
      setError("");
      setQuantity(value);
    }
  };
  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);

    setQuantity(1);
    setError("");
  };

  const handleProceedToPay = async () => {
    if (!selectedTicket) {
      toast.warning("Select a ticket type");
      return;
    }
    setLoadingText(true);
    try {
      // 1️⃣ Check availability
      const checkRes = await api.post(
        "/bookings/check-availability",
        {
          eventId,
          ticketId: selectedTicket._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!checkRes.data.available) {
        toast.error("Not enough tickets available");
        return;
      }

      // 2️⃣ Create booking
      const bookingRes = await api.post(
        "/bookings/create",
        {
          eventId,
          ticketId: selectedTicket._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const bookingId = bookingRes.data.booking._id;
      setBookingId(bookingId);

      // 3️⃣ Create payment intent
      const paymentRes = await api.post(
        "/payment/create-intent",
        { bookingId, eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setClientSecret(paymentRes.data.clientSecret);
      setLoadingText(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    }
  };

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
      navigate(`/${role}/events`);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/event/delete/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Event deleted successfully");
      navigate(`/${role}/events`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!event) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lime-600">
        <ClipLoader color="#00897B" size="40px" />
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className=" min-h-screen">
          {!loading && event ? (
            <div className="w-full  m-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold mb-4 ">
                    {event.title}{" "}
                    <span className="font-bold text-sm px-2 py-0.5 bg-teal-500 hover:bg-teal-600 text-white rounded-sm">
                      {event.status}
                    </span>
                  </h1>

                  {role === "admin" && event.status === "pending" ? (
                    <>
                      <button
                        className="px-2 py-1 bg-lime-500 hover:bg-lime-600 text-white rounded-xl"
                        onClick={() => {
                          updateEventStatus(event._id, "published");
                        }}>
                        <span className="font-bold text-lg">Publish</span>
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex justify-center items-center ">
                    <img
                      className="rounded-xl shadow-lg my-6  max-w-md max-h-100 object-cover"
                      src={
                        event.bannerImage ||
                        "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-no-photo-icon-image_1128432.jpg"
                      }
                      alt={event.title}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Category:{" "}
                      <span className="text-sm font-medium">
                        {event.category}
                      </span>
                    </h2>
                    <h2 className="text-lg font-bold mb-2">
                      Description:{" "}
                      <p className="text-sm font-medium">{event.description}</p>
                    </h2>
                    <h2 className="text-lg font-bold">
                      Date:{" "}
                      <span className="text-sm font-medium">
                        {new Date(event.startDate).toDateString()} -{" "}
                        {new Date(event.startDate).toDateString()}
                      </span>
                    </h2>
                    {/* 
                <h2 className="text-xl font-semibold mb-2">Tickets</h2>
                <ul className="list-disc list-inside mb-4">
                  {event.tickets.map((ticket, index) => (
                    <li className="mb-2" key={index}>
                      Ticket {index + 1}: {ticket.name} - ${ticket.price}{" "}
                      (Quantity: {ticket.quantity})
                    </li>
                  ))}
                </ul> */}
                    {event.isOnline ? (
                      <>
                        <h2 className="text-xl font-semibold mb-2">Online</h2>
                        <p>{event.onlineLink}</p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold mb-2">Venue</h2>
                        <p>
                          {[
                            event.location?.address,
                            event.location?.city,
                            event.location?.state,
                            event.location?.country,
                            event.location?.pincode,
                          ]
                            .filter(Boolean)
                            .map((line, index) => (
                              <span key={index}>
                                {line},
                                <br />
                              </span>
                            ))}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {role === "user" ? (
                  <>
                    {/* Ticket Selection */}
                    <h2 className="text-xl font-semibold">Select Tickets</h2>
                    <div className="mt-6 space-y-3">
                      {event.tickets.map((ticket) => (
                        <label
                          key={ticket._id}
                          className="flex justify-between border p-3 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="ticket"
                            onChange={() => handleTicketSelect(ticket)}
                          />
                          <span>
                            {ticket.ticketType} - ({ticket.quantity}
                            {" Total Tickets"})
                          </span>
                          <span>₹{ticket.price}</span>
                        </label>
                      ))}
                    </div>
                    {selectedTicket && (
                      <p className="text-sm text-gray-600 mt-1">
                        Available: <b>{getAvailableTickets()}</b>
                      </p>
                    )}
                    {/* Quantity */}
                    <div className="mt-4">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        disabled={!selectedTicket}
                        onChange={handleQuantityChange}
                        className="border p-2 rounded w-24"
                        placeholder="Enter Tickets"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                    {!clientSecret ? (
                      <button
                        disabled={
                          !selectedTicket || quantity > getAvailableTickets()
                        }
                        onClick={handleProceedToPay}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded">
                        {loadingText ? "Loading..." : "Proceed to Payment"}
                      </button>
                    ) : (
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}>
                        <CheckoutForm bookingId={bookingId} token={token} />
                      </Elements>
                    )}
                  </>
                ) : (
                  <>
                    {/* <h3 className="text-xl font-semibold mt-8 mb-4">
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
                              <th className="px-4 py-2 text-left">Email</th>
                              <th className="px-4 py-2 text-left">Tickets</th>
                              <th className="px-4 py-2 text-left">Amount</th>
                              <th className="px-4 py-2 text-left">Booked At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendees.map((attendee) => (
                              <tr key={attendee.bookingId} className="border-t">
                                <td className="px-4 py-2">{attendee.name}</td>
                                <td className="px-4 py-2">{attendee.email}</td>
                                <td className="px-4 py-2">
                                  {attendee.tickets}
                                </td>
                                <td className="px-4 py-2">
                                  ₹{attendee.totalAmount}
                                </td>
                                <td className="px-4 py-2">
                                  {new Date(attendee.bookedAt).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )  }*/}
                    <div className="flex justify-end items-center gap-4 ">
                      <button
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                        onClick={() => {
                          updateEventStatus(event._id, "cancelled");
                        }}>
                        <span className="font-bold text-lg">Cancel</span>
                      </button>
                      <button
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        onClick={() => {
                          updateEventStatus(event._id, "completed");
                        }}>
                        <span className="font-bold text-lg">Completed?</span>
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        className=" cursor-pointer bg-red-600 text-white  font-bold px-3 py-2 rounded-lg hover:bg-red-500">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <h1>No data Fetched</h1>
          )}
          <div className=""></div>
        </div>
      </div>
    </>
  );
};

export default EventOverview;
