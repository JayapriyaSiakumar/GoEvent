import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { menuConfig } from "./menuConfig.js";
import { toast } from "react-toastify";
import api from "../../Services/api.js";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setIsProfileOpen] = useState(false);
  const { role, userId, token } = useSelector((state) => state.auth);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/auth/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
        //toast.success("User Data Fetched Successfully");
      } catch (error) {
        toast.error("Something Went Wrong", error);
      }
    };
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-teal-600  text-white shadow-lg">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center font-extrabold text-3xl text-heading  whitespace-nowrap">
              Go-Eventz
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!profileOpen)}
              className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom">
              <span className="sr-only">Open user menu</span>
              <span className="font-medium text-sm py-1.5 px-1  text-white rounded-sm">
                {role}
              </span>
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={
                  user?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
                }
                alt="user photo"
              />{" "}
            </button>
            {/* Dropdown menu */}
            <div
              className={`z-50 ${
                profileOpen ? "absolute top-0 right-0 mt-14" : "hidden"
              } bg-teal-600   rounded-lg shadow-2xl w-44`}
              id="user-dropdown">
              <div className="px-4 py-3 text-sm border-b border-default">
                <span className="block text-heading font-medium">
                  {user?.name || "User Name"}
                </span>
                <span className="block text-body truncate">
                  {user?.email || "User Email"}
                </span>
              </div>
              <ul
                className="p-2 text-sm text-body font-medium"
                aria-labelledby="user-menu-button">
                <li>
                  <Link
                    to="/profile"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    role="menuitem">
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logout"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    role="menuitem">
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-user"
              aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>
          <div
            /* className={
              isOpen
                ? "items-center justify-between w-1/2 md:flex md:w-auto md:order-1"
                : "items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            } */
            className={`${
              isOpen
                ? "z-50  absolute top-0 right-0 mt-14 bg-teal-600   rounded-lg shadow-2xl w-44"
                : "hidden"
            }  md:items-center justify-between  md:flex md:w-auto md:order-1`}
            id="navbar-user">
            <ul className="font-medium flex flex-col p-2 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
              {menuConfig[role].map((ele, index) => (
                <li key={index}>
                  <Link
                    to={ele.path}
                    className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <span className="ms-3">{ele.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
