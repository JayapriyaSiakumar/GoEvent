import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckoutForm = ({ token }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) return;

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const response = await api.post(
        "/payment/confirm",
        { paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLoading(false);
      toast.success(
        response.data.message || "Payment successful 🎉 Booking confirmed",
      );

      navigate("/user/bookings");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Payment confirmation failed";

      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <PaymentElement className="border p-4 rounded" />

      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
