import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../Services/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllSchedules = async () => {
    setLoading(true);
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
      //console.log(formatted);
      setEvents(formatted);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load all schedules", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lime-600">
        <ClipLoader color="#00897B" size="40" />
      </div>
    );
  }

  return (
    <div className="bg-white mt-14 p-10  w-full rounded-lg max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📅 All Events Schedule</h2>
      {events?.length === 0 ? (
        <>
          <div className="bg-white p-6 rounded-xl w-full">
            <div className=" flex flex-col justify-center items-center w-full h-75">
              <h3 className="text-2xl">No Data Found</h3>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 m-auto  p-10  max-w-6xl">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
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
        </>
      )}
    </div>
  );
};
/* ,timeGridDay */
export default SchedulerCalendar;
