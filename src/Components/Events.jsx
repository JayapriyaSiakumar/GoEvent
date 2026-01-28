import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setEvents } from "../Redux/Features/eventSlice";
import FilterForm from "./FilterForm";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { ClipLoader } from "react-spinners";

const Events = () => {
  const dispatch = useDispatch();
  const { filteredEvents } = useSelector((state) => state.events);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role } = useSelector((state) => state.auth);
  const [filterModal, setFilterModal] = useState(false);

  const navigate = useNavigate();

  // Fetch organizer events
  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/event/my-events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch(setEvents(res.data.events));
      setLoading(false);
    } catch (err) {
      setError("Failed to load my events", err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/event/all-events");

      dispatch(setEvents(res.data.events));
      setLoading(false);
    } catch (err) {
      setError("Failed to load all events", err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/event/all-published-events");
      dispatch(setEvents(res.data.events));
      setLoading(false);
    } catch (err) {
      setError("Failed to load all events", err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "organizer") {
      fetchMyEvents();
    } else if (role === "admin") {
      fetchAllEvents();
    } else {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-lime-600">
        <ClipLoader color="#00897B" size="40px" />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-14 max-w-7xl mx-auto">
      <div className="p-6 ">
        {/* <div className="p-4 sm:ml-54 mt-14">
      <div className="p-6 border border-default  rounded-lg border-gray-300 min-h-screen">  */}
        <div className="flex justify-between items-center gap-4 w-full">
          <h2 className="text-2xl font-bold mb-6">Events</h2>
          <button
            onClick={() => setFilterModal(true)}
            className="px-3 py-2 text-white bg-teal-600 rounded-lg shadow-lg  hover:bg-teal-700 transition">
            <HiAdjustmentsHorizontal className="text-2xl font-bold" />
          </button>
          {filterModal && (
            <div className="fixed top-0 right-0 z-50  w-90 p-4 overflow-x-hidden overflow-y-auto md:inset-y-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative p-4 w-full max-w-md max-h-100 ">
                {/* Modal content */}
                <div className="relative bg-neutral-primary-soft bg-white shadow-2xl rounded-lg p-4 md:p-6">
                  {/* Modal header */}
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-lg font-medium text-heading">
                      Filter Form
                    </h3>
                    <button
                      type="button"
                      onClick={() => setFilterModal(false)}
                      className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                      data-modal-hide="default-modal">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18 17.94 6M18 18 6.06 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="space-y-4 md:space-y-6 ">
                    <FilterForm />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="">
          {filteredEvents.length === 0 ? (
            <div className="flex justify-center items-center w-full h-[60vh]">
              {" "}
              <h2 className="text-2xl font-bold text-gray-800">
                No Events Published Yet.
              </h2>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id}>
                  <div className="max-w-sm  mx-auto rounded-md overflow-hidden shadow-md hover:shadow-lg">
                    <div className="relative">
                      <img
                        className="w-full h-50"
                        src={
                          event.bannerImage
                            ? event.bannerImage
                            : "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-no-photo-icon-image_1128432.jpg"
                        }
                        alt="Event Image"
                      />
                      <div className="absolute top-0 right-0 bg-teal-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                        {event.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">
                        {event.title}
                      </h3>
                      <div className="text-gray-600 text-sm mb-4">
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(event.startDate).toLocaleDateString()} –{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex justify-between items-center w-full text-sm">
                        {role === "organizer" ? (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/${role}/edit-event/${event._id}`)
                              }
                              className="bg-amber-500 hover:bg-amber-600 text-white  py-1 px-2 rounded">
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/${role}/view-event/${event._id}`)
                              }
                              className="bg-indigo-500 hover:bg-indigo-600 text-white  py-1 px-2 rounded">
                              View
                            </button>
                          </>
                        ) : role === "admin" ? (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/${role}/view-event/${event._id}`)
                              }
                              className="bg-indigo-500 hover:bg-indigo-600 text-white  py-1 px-2 rounded">
                              View
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/${role}/view-event/${event._id}`)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
