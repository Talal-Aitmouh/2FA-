import { useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").catch(() => {
      navigate("/");
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <button
        onClick={logout}
        className="bg-red-600 px-6 py-3 rounded"
      >
        Logout
      </button>
    </div>
  );
}
