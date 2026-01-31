import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Services/api.js";
import { LuEyeOff } from "react-icons/lu";
import { GoEye } from "react-icons/go";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { id, token } = useParams();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/auth/resetPassword/${id}/${token}`, {
        password,
      });
      toast.success(response.data.message);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    }

    setPassword("");
  };

  return (
    <div>
      <div className="w-full bg-linear-to-br from-purple-950 via-purple-800 to-purple-950  mx-auto p-6">
        <div className="mt-7 max-w-md bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Reset password?
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
                {error && (
                  <div className="bg-red-100 p-3 mb-4 text-red-600 rounded">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                      Password
                    </label>
                    <div className="mt-1 rounded-md shadow-sm relative">
                      <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter New Password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password">
                        {isVisible ? (
                          <LuEyeOff size={20} aria-hidden="true" />
                        ) : (
                          <GoEye size={20} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Reset password
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

export default ResetPassword;
