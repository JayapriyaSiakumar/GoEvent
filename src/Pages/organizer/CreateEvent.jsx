import { useState } from "react";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    bannerImage: null,
    category: "Conference",
    startDate: "",
    endDate: "",
    isOnline: false,
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    onlineLink: "",
  });

  const [tickets, setTickets] = useState([
    { ticketType: "", price: "", quantity: "" },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData((prev) => ({
      ...prev,
      bannerImage: file,
    }));
    setPreview(URL.createObjectURL(file));
    //console.log(e.target.files[0]);
  };

  // Handle main form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEventData({ ...eventData, [name]: checked });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  // Handle location fields
  const handleLocationChange = (e) => {
    setEventData({
      ...eventData,
      location: {
        ...eventData.location,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Ticket handlers
  const handleTicketChange = (index, e) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][e.target.name] = e.target.value;
    setTickets(updatedTickets);
  };

  const addTicket = () => {
    setTickets([...tickets, { ticketType: "", price: "", quantity: "" }]);
  };

  const removeTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("category", eventData.category);
    formData.append("startDate", eventData.startDate);
    formData.append("endDate", eventData.endDate);
    formData.append("isOnline", eventData.isOnline);
    formData.append("location", JSON.stringify(eventData.location));
    formData.append("onlineLink", eventData.onlineLink);

    formData.append(
      "tickets",
      JSON.stringify(
        tickets.map((t) => ({
          ticketType: t.ticketType,
          price: Number(t.price),
          quantity: Number(t.quantity),
        })),
      ),
    );
    if (eventData.bannerImage) {
      formData.append("bannerImage", eventData.bannerImage);
    }

    try {
      /* const payload = {
        ...eventData,
        tickets: tickets.map((t) => ({
          ticketType: t.ticketType,
          price: Number(t.price),
          quantity: Number(t.quantity),
        })),
      }; */

      console.log(formData);
      const response = await api.post("/event/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(response.data.message);
      navigate(`/${role}/events`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4  mt-14">
      <div className="p-6  min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Create Event</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 mb-6 md:grid-cols-2"></div>

          <div className="">
            <label
              htmlFor="photo"
              className="block text-sm/6 font-medium text-gray-900">
              Banner Image
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <div className="w-32 h-32 rounded-xl  border border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <label className="block">
                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="px-4 cursor-pointer block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Choose Image
                </span>
              </label>
            </div>
          </div>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventData.title}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            value={eventData.description}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />

          {/* Category */}
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Concert">Concert</option>
            <option value="Webinar">Webinar</option>
            <option value="Festival">Festival</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="font-medium">
                Start
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={eventData.startDate}
                placeholder="Enter Start Date and Time"
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="font-medium">
                End
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={eventData.endDate}
                placeholder="Enter End Date and Time"
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Online toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isOnline"
              checked={eventData.isOnline}
              onChange={handleChange}
            />
            Online Event
          </label>

          {/* Location */}
          {!eventData.isOnline && (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="address"
                placeholder="Address"
                value={eventData.location.address}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="city"
                placeholder="City"
                value={eventData.location.city}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="state"
                placeholder="State"
                value={eventData.location.state}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="country"
                placeholder="Country"
                value={eventData.location.country}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={eventData.location.pincode}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          )}

          {/* Online link */}
          {eventData.isOnline && (
            <input
              name="onlineLink"
              placeholder="Online Meeting Link"
              value={eventData.onlineLink}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          )}

          {/* Tickets */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tickets</h3>

            {tickets.map((ticket, index) => (
              <div key={index} className="grid grid-cols-4 gap-3 mb-3">
                <input
                  name="ticketType"
                  placeholder="Type"
                  value={ticket.ticketType}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Qty"
                  value={ticket.quantity}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <button
                  type="button"
                  onClick={() => removeTicket(index)}
                  className="text-red-500">
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addTicket} className="text-blue-600">
              + Add Ticket
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-blue-700">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
