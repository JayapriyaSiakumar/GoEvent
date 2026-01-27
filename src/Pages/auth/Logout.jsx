import React, { useEffect } from "react";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.post(
        "/auth/logout",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
};

export default Logout;
