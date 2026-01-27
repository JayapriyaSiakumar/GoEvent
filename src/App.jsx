import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Logout from "./Pages/auth/Logout";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import ResetPassword from "./Pages/auth/ResetPassword";
import ProtectedRoute from "./Components/ProtectedRoute";
import Sidebar from "./Components/sidebar/Sidebar";
import Profile from "./Pages/common/Profile";
import User from "./Pages/user/User";
import ViewEvent from "./Pages/user/ViewEvent";
import MyBookings from "./Pages/user/MyBookings";
import Dashboard from "./Pages/organizer/Dashboard";
import CreateEvent from "./Pages/organizer/CreateEvent";
import EditEvent from "./Pages/organizer/EditEvent";
import OrganizerEvents from "./Pages/organizer/OrganizerEvents";
import { useSelector } from "react-redux";
import NotFound from "./Components/NotFound";
import Home from "./Pages/common/Home";
import AllUsers from "./Pages/admin/AllUsers";
import AllPayments from "./Pages/admin/AllPayments";
import EventDetails from "./Pages/common/EventDetails";
import SchedulerCalendar from "./Pages/user/SchedulerCalendar";

const App = () => {
  const { role } = useSelector((state) => state.auth);
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/${role}/view-event/:id`}
            element={
              <ProtectedRoute>
                <Sidebar />
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute>
                <Sidebar />
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/admin`}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/organizer`}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/add"
            element={
              <ProtectedRoute>
                <Sidebar />
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path={`/${role}/events/`}
            element={
              <ProtectedRoute>
                <Sidebar />
                <OrganizerEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/${role}/edit-event/:id`}
            element={
              <ProtectedRoute>
                <Sidebar />
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Sidebar />
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/payments"
            element={
              <ProtectedRoute>
                <Sidebar />
                <AllPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <Sidebar />
                <AllPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/${role}/event-details/:id`}
            element={
              <ProtectedRoute>
                <Sidebar />
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path={`/user/schedules`}
            element={
              <ProtectedRoute>
                <Sidebar />
                <SchedulerCalendar />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
