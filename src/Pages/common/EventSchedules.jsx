import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { formatTimeAMPM, toTimeInputValue } from "../../Utils/date";

const EventSchedules = ({ eventId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, token } = useSelector((state) => state.auth);
  const [schedules, setSchedules] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const initialFormState = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    speaker: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const fetchData = async () => {
    try {
      const response = await api.get(`/schedule/all/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSchedules(response.data.data);
      //toast.success("Data Fetched Successfully");
    } catch (error) {
      toast.error("Something Went Wrong", error);
    }
  };

  const openAddModal = () => {
    setEditingScheduleId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setEditingScheduleId(schedule._id);
    setFormData({
      title: schedule.title,
      description: schedule.description,
      speaker: schedule.speaker,
      startTime: toTimeInputValue(schedule.startTime),
      endTime: toTimeInputValue(schedule.endTime),
    });
    setIsModalOpen(true);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingScheduleId
        ? `/schedule/update/${editingScheduleId}`
        : `/schedule/create/`;

      const method = editingScheduleId ? api.put : api.post;

      const res = await method(
        url,
        { ...formData, eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      const res = await api.delete(`/schedule/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      toast.error("Delete failed", err.message);
    }
  };
  const handleSendEmail = async () => {
    /* if (!window.confirm("You want to Notify Schedules to your users By Email?"))
      return; */

    try {
      const res = await api.post(
        `/schedule/notify-schedule/${eventId}`,
        { schedules },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || err?.message);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-lg font-semibold">Event Schedules</h2>
        {role === "organizer" && (
          <div className="">
            <div className="flex justify-between items-center gap-3 w-full">
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                onClick={openAddModal}>
                + Add Schedule
              </button>
              <button
                onClick={handleSendEmail}
                type="button"
                className="  px-3 py-2 bg-orange-400 text-white hover:bg-orange-500 rounded-md cursor-pointer">
                Send Email
              </button>
            </div>
          </div>
        )}
        {role === "organizer" && isModalOpen && (
          <div
            id="authentication-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
            <div className="relative p-4 w-full max-w-lg max-h-full">
              {/* Modal content */}
              <div className="relative bg-white shadow-2xl rounded-lg p-4 md:p-6 ">
                {/* Modal header */}
                <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                  <h3 className="text-lg font-medium text-heading">
                    {editingScheduleId ? "Edit Schedule" : "Add Schedule"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                    data-modal-hide="authentication-modal">
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
                <form
                  onSubmit={handleSubmit}
                  className="pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleOnChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Enter Session Title"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading">
                      Description
                    </label>
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleOnChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Enter Session Title"
                      required></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading">
                      Speaker Name
                    </label>
                    <input
                      type="text"
                      id="speaker"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleOnChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Enter Speaker Name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleOnChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Enter Start Time"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2.5 text-sm font-medium text-heading">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleOnChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Enter End Time"
                      required
                    />
                  </div>

                  <div className="mb-4 h-full flex justify-end items-center w-full">
                    <button
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-600 text-white  py-1 px-2 rounded">
                      {editingScheduleId ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule List */}

      {schedules === null || schedules?.length === 0 ? (
        <div className="flex justify-center items-center w-full h-1/2">
          {" "}
          <h2 className="text-xl font-bold text-gray-800">
            No Schedules Found.
          </h2>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto max-w-7xl bg-white shadow rounded mt-3 m-auto">
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speaker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  {role === "organizer" && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-6 py-4  text-sm font-serif ">
                      {s.title}
                    </td>
                    <td className="px-6 py-4  text-sm font-sans">
                      {s.speaker}
                    </td>

                    <td className="px-6 py-4  text-sm font-sans">
                      {s.description}
                    </td>
                    <td className="px-6 py-4 ">
                      {formatTimeAMPM(s.startTime)}
                    </td>
                    <td className="px-6 py-4  text-sm font-sans">
                      {formatTimeAMPM(s.endTime)}
                    </td>
                    {role === "organizer" && (
                      <td className="flex justify-center items-center gap-2  px-6 py-4 text-sm font-sans">
                        <button
                          onClick={() => openEditModal(s)}
                          className="text-sm font-light px-1.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(s._id)}
                          className="text-sm font-light px-1.5 py-1 bg-red-600 text-white hover:bg-red-700">
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EventSchedules;
