import { useState } from "react";
import { useSelector } from "react-redux";
import EventOverview from "./EventOverview";
import EventSchedules from "./EventSchedules";
import EventAttendees from "./EventAttendees";
import EventPayments from "./EventPayments";

const EventDetailsTabs = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { role } = useSelector((state) => state.auth);

  const tabClasses = (tab) =>
    `px-4 py-2 font-medium cursor-pointer border-b-2 transition
     ${
       activeTab === tab
         ? "border-blue-600 text-blue-600"
         : "border-transparent text-gray-500 hover:text-blue-500"
     }`;

  return (
    <div className="mt-6 overflow-auto">
      {/* Tabs Header */}
      <div className="flex gap-2 border-b">
        <button
          className={tabClasses("overview")}
          onClick={() => setActiveTab("overview")}>
          Overview
        </button>

        <button
          className={tabClasses("schedule")}
          onClick={() => setActiveTab("schedule")}>
          Schedules
        </button>
        {(role === "admin" || role === "organizer") && (
          <>
            <button
              className={tabClasses("attendees")}
              onClick={() => setActiveTab("attendees")}>
              Attendees
            </button>
            <button
              className={tabClasses("payments")}
              onClick={() => setActiveTab("payments")}>
              Payments
            </button>
          </>
        )}
      </div>

      {/* Tabs Content */}
      <div className="">
        {activeTab === "overview" && (
          <div>
            <EventOverview eventId={eventId} />
          </div>
        )}

        {activeTab === "schedule" && (
          <div>
            <EventSchedules eventId={eventId} />
          </div>
        )}

        {activeTab === "attendees" && (
          <div>
            <EventAttendees eventId={eventId} />
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <EventPayments eventId={eventId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsTabs;
