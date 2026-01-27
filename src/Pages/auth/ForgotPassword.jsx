import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Services/api.js";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/forgotPassword", { email });
      toast.success(response.data.message);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    }

    setEmail("");
  };

  return (
    <div className="bg-linear-to-br from-purple-950 via-purple-800 to-purple-950 w-full h-screen">
      <div id="content" role="main" className="w-full  max-w-md mx-auto p-6">
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <Link
                  className="text-blue-600 decoration-2 hover:underline font-medium"
                  to="/login">
                  Login here
                </Link>
              </p>
            </div>
            <div className="mt-5">
              <form method="POST" onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                      Registered Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                        aria-describedby="email-error"
                        placeholder="Enter Registered Email Address"
                      />
                    </div>
                    {error && (
                      <div className="mt-2 bg-red-100 p-3 mb-4 text-red-600 rounded">
                        {error}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
