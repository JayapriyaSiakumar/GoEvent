import React, { useEffect, useState } from "react";
import { LuEyeOff } from "react-icons/lu";
import { GoEye } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../Services/api.js";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const sendOtp = async () => {
    try {
      await api.post("/auth/send-email-otp", { email });
      setSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-email-otp", { email, otp });
      setEmailVerified(true);
      toast.success("Email verified 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        name: name,
        email,
        role,
        password,
        emailVerified,
      });

      toast.success(response.data.message);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const checkLoggedIn = () => {
    const loggedInRole = localStorage.getItem("role");
    if (loggedInRole) {
      toast.error("Already Logged In");
      navigate(`/${loggedInRole}`);
    }
  };

  useEffect(() => {
    checkLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-800 to-purple-950  flex flex-col justify-center py-5 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-white">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
            Or
            <Link
              to="/login"
              className="font-medium text-gray-100 hover:text-gray-200 focus:outline-none focus:underline transition ease-in-out duration-150">
              login to your account
            </Link>
          </p>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form method="POST" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 p-3 mb-4 text-red-600 rounded">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5  text-gray-700">
                  Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    placeholder="Enter Your Name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md ">
                  <div className="mt-4 flex justify-between items-center gap-3">
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      placeholder="Enter Your Valid Email"
                      type="email"
                      required
                      className="shadow-sm appearance-none block w-3/4 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />

                    {!emailVerified ? (
                      <div>
                        {!sent ? (
                          <button
                            onClick={sendOtp}
                            type="button"
                            className="bg-green-600 text-white px-2 py-1 rounded">
                            Verify
                          </button>
                        ) : (
                          <div className="flex justify-between items-center w-full gap-2">
                            <input
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter OTP"
                              className="shadow-sm appearance-none block w-3/4 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            />
                            <button
                              onClick={verifyOtp}
                              type="button"
                              className="bg-green-600 text-white px-2 py-1 rounded">
                              Confirm
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button className="bg-green text-white rounded-full p-4">
                        ✔
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-gray-700">
                  Password
                </label>
                <div className="mt-1 rounded-md shadow-sm relative">
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  <button
                    className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
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
              <div className="mt-6">
                <label
                  htmlFor="rol"
                  className="block text-sm font-medium leading-5  text-gray-700">
                  Role
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    <option value="user">User</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Register
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
