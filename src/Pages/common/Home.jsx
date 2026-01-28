import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Events from "../../Components/Events";

const Home = () => {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate("/user");
    } else if (role === "organizer") {
      navigate("/organizer");
    } else if (role === "admin") {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="fixed top-0 z-50 w-full bg-teal-600  text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 ">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-stretch justify-start">
              <Link to="/" className="flex ms-2 md:me-24">
                <span className="self-center font-extrabold text-3xl text-heading  whitespace-nowrap">
                  Go-Eventz
                </span>
              </Link>
            </div>
            <div className="flex shrink-0  px-2 py-3 items-center space-x-8">
              <Link
                className="text-gray-100 hover:text-indigo-700 text-md font-semibold"
                to="/login">
                Login
              </Link>
              <Link
                className="text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-md font-medium rounded-md shadow-sm "
                to="/register">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Events />
    </>
  );
};

export default Home;
