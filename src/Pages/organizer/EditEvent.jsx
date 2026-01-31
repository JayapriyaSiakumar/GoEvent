import { useEffect, useState } from "react";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
//import { toDateTimeLocal } from "../../Utils/date";

const EditEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const eventId = useParams().id;
  const { role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
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

  const fetchData = async () => {
    try {
      const res = await api.get(`/event/getEvent/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData(res.data.event);
      setTickets(res.data.event.tickets);
      setPreview(res.data.event.bannerImage);
    } catch (err) {
      setError("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tickets, setTickets] = useState([
    { ticketType: "", price: "", quantity: "" },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
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
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    //console.log(formData);
  };

  // Handle location fields
  const handleLocationChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
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

    try {
      const eventDetails = new FormData();

      eventDetails.append("title", formData.title);
      eventDetails.append("description", formData.description);
      eventDetails.append("category", formData.category);
      eventDetails.append("startDate", formData.startDate);
      eventDetails.append("endDate", formData.endDate);
      eventDetails.append("isOnline", formData.isOnline);
      eventDetails.append("onlineLink", formData.onlineLink);

      eventDetails.append("location", JSON.stringify(formData.location));

      eventDetails.append(
        "tickets",
        JSON.stringify(
          tickets.map((t) => ({
            ticketType: t.ticketType,
            price: Number(t.price),
            quantity: Number(t.quantity),
          })),
        ),
      );

      // 🔥 only if new image selected
      if (formData.bannerImage instanceof File) {
        eventDetails.append("bannerImage", formData.bannerImage);
      }
      const response = await api.put(`/event/update/${eventId}`, eventDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(response.data.message);
      navigate(`/${role}/events`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to Update event");
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date) => date?.split("T")[0];

  return (
    <div className="p-4  mt-14">
      <div className="p-6  min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Edit Event</h2>

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
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
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
                type="date"
                name="startDate"
                min={new Date().toISOString().split("T")[0]}
                value={formatDate(formData.startDate)}
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
                type="date"
                name="endDate"
                min={new Date().toISOString().split("T")[0]}
                value={formatDate(formData.endDate)}
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
              checked={formData.isOnline}
              onChange={handleChange}
            />
            Online Event
          </label>

          {/* Location */}
          {!formData.isOnline && (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="address"
                placeholder="Address"
                value={formData.location.address}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.location.city}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="state"
                placeholder="State"
                value={formData.location.state}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="country"
                placeholder="Country"
                value={formData.location.country}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={formData.location.pincode}
                onChange={handleLocationChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          )}

          {/* Online link */}
          {formData.isOnline && (
            <input
              name="onlineLink"
              placeholder="Online Meeting Link"
              value={formData.onlineLink}
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
            {loading ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
