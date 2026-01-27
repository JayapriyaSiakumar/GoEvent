import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../Services/api";
import { useSelector } from "react-redux";

const eventColors = {};

const getColor = (eventTitle) => {
  if (!eventColors[eventTitle]) {
    eventColors[eventTitle] =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  return eventColors[eventTitle];
};

const SchedulerCalendar = () => {
  const { token } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAllSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllSchedules = async () => {
    try {
      const res = await api.get("/schedule/all-event-schedules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.map((item) => ({
        title: item.title,
        start: new Date(item.start),
        end: new Date(item.end),
        backgroundColor: getColor(item.eventTitle),
        extendedProps: {
          speaker: item.speaker,
          description: item.description,
          eventTitle: item.eventTitle,
        },
      }));
      console.log(formatted);
      setEvents(formatted);
    } catch (error) {
      console.error("Failed to load all schedules", error);
    }
  };

  return (
    <div className="bg-white mt-14 max-w-6xl p-10 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">📅 All Events Schedule</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={(info) => {
          alert(
            `🎫 Event: ${info.event.extendedProps.eventTitle}
📌 Session: ${info.event.title}
🎤 Speaker: ${info.event.extendedProps.speaker || "N/A"}
📝 ${info.event.extendedProps.description || "No description"}`,
          );
        }}
        height="auto"
      />
    </div>
  );
};

export default SchedulerCalendar;
