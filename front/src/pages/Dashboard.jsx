import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        🎉 Welcome to Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
      >
        Logout
      </button>
    </div>
  );
}
