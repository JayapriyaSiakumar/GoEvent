import { useState } from "react";
import api from "../Services/api";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);

  const sendOtp = async () => {
    try {
      await api.post("/auth/send-email-otp");
      setSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-email-otp", { otp });
      toast.success("Email verified 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {!sent ? (
        <button
          onClick={sendOtp}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Verify Email
        </button>
      ) : (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2 w-full mb-3"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded">
            Confirm OTP
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
