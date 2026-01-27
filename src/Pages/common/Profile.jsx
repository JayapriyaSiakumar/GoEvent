import React, { useEffect, useState } from "react";

import api from "../../Services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: null,
    location: "",
    bio: "",
  });

  const fetchUserDetail = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.get(`/auth/getUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserDetail(response.data.data);
      //console.log(response.data.data.name);
      setPreview(response.data.data.profileImage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserDetail();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserDetail((prev) => ({
      ...prev,
      profileImage: file,
    }));
    setPreview(URL.createObjectURL(file));
    //console.log(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      userDetail.name === "" ||
      userDetail.email === "" ||
      userDetail.location === "" ||
      userDetail.phone === ""
    ) {
      setError("Name, Email, Location, Phone should not be empty.");
      return;
    }
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("name", userDetail.name);
    formData.append("email", userDetail.email);
    formData.append("phone", userDetail.phone);
    formData.append("location", userDetail.location);
    formData.append("bio", userDetail.bio);

    if (userDetail.profileImage) {
      formData.append("profileImage", userDetail.profileImage);
    }
    try {
      console.log(formData);
      const response = await api.post(
        `/auth/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-4  mt-14">
      <div className="p-6 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-12">
            <div className="">
              <h2 className="text-4xl font-semibold text-gray-900 ">Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
              {error && (
                <div className="bg-red-100 p-3 mb-4 text-red-600 rounded">
                  {error}
                </div>
              )}
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm/6 font-medium text-gray-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
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
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <span className="px-4 ursor-pointer block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Choose Image
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-span-full md:col-span-3 ">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                        Go-Eventz/
                      </div>
                      <input
                        value={userDetail.name}
                        onChange={(e) =>
                          setUserDetail((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        type="text"
                        placeholder="Enter your name"
                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full md:col-span-3">
                  <label
                    htmlFor="about"
                    className="block text-sm/6 font-medium text-gray-900">
                    Bio
                  </label>
                  <div className="mt-2">
                    <textarea
                      value={userDetail.bio}
                      onChange={(e) =>
                        setUserDetail((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={1}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Write a few sentences about yourself"
                    />
                  </div>
                </div>

                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div> */}

                <div className="col-span-full  md:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      value={userDetail.email}
                      onChange={(e) =>
                        setUserDetail((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email address"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full md:col-span-3 ">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={userDetail.location}
                      onChange={(e) =>
                        setUserDetail((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Enter your location"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full md:col-span-3 ">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={userDetail.phone}
                      onChange={(e) =>
                        setUserDetail((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter your phone number"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
