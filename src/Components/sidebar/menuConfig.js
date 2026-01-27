export const menuConfig = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Events", path: "/admin/events" },
    { label: "Payments", path: "/admin/payments" },
  ],

  organizer: [
    { label: "Dashboard", path: "/organizer" },
    { label: "My Events", path: "/organizer/events" },
    { label: "Add Event", path: "/organizer/events/add" },
    { label: "Payments", path: "/organizer/payments" },
  ],

  user: [
    { label: "Explore Events", path: "/user/" },
    { label: "My Bookings", path: "/user/bookings" },
    { label: "Schedules", path: "/user/schedules" },
  ],
};
