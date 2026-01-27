import { useParams } from "react-router-dom";
import EventDetailsTabs from "./EventDetailsTabs";

const EventDetails = () => {
  const eventId = useParams().id;

  return (
    <div className="w-full mx-auto mt-14 p-10">
      <h1 className="text-2xl font-bold">Event Details</h1>
      <EventDetailsTabs eventId={eventId} />
    </div>
  );
};

export default EventDetails;
