import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../stripe";
import CheckoutForm from "./CheckoutForm";
import api from "../../Services/api";
//import { useParams } from "react-router-dom";

const EventBooking = ({ eventId }) => {
  //const eventId = useParams().id;
  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const token = localStorage.getItem("token");
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    api.get(`/event/getEvent/${eventId}`).then((res) => {
      setEvent(res.data.event);
    });
  }, [eventId]);

  const handleProceedToPay = async () => {
    if (!selectedTicket) return alert("Select a ticket type");

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!checkRes.data.available) {
        return alert("Not enough tickets available");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setBookingId(bookingRes.data.booking._id);
      // 3️⃣ Create payment intent
      const paymentRes = await api.post(
        "/payments/create-intent",
        {
          bookingId: bookingRes.data.booking._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setClientSecret(paymentRes.data.clientSecret);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{event.title}</h2>

      {/* Ticket Selection */}
      <div className="mt-6 space-y-3">
        {event.tickets.map((ticket) => (
          <label
            key={ticket._id}
            className="flex justify-between border p-3 rounded cursor-pointer">
            <input
              type="radio"
              name="ticket"
              onChange={() => setSelectedTicket(ticket)}
            />
            <span>{ticket.ticketType}</span>
            <span>₹{ticket.price}</span>
          </label>
        ))}
      </div>

      {/* Quantity */}
      <div className="mt-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
      </div>

      {!clientSecret ? (
        <button
          onClick={handleProceedToPay}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded">
          Proceed to Payment
        </button>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm bookingId={bookingId} token={token} />
        </Elements>
      )}
    </div>
  );
};

export default EventBooking;
