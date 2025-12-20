import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [qr, setQr] = useState("");
  const [step, setStep] = useState("login"); 
  // login | qr | otp
  const [message, setMessage] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      if (res.data.status === "NEW_USER") {
        setQr(res.data.qr);
        setStep("qr");
      }

      if (res.data.status === "EXISTING_USER") {
        setStep("otp");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/verify", {
        email,
        token: otp,
      });

      if (res.data.success) {

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>


        {step === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 rounded bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 rounded bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>
          </form>
        )}


        {step === "qr" && (
          <div className="text-center">
            <p className="mb-4">Scan this QR with Google Authenticator</p>
            <img src={qr} alt="QR Code" className="mx-auto mb-4" />

            <button
              onClick={() => setStep("otp")}
              className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold"
            >
              I have scanned the QR
            </button>
          </div>
        )}


        {step === "otp" && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="123456"
              className="w-full mb-4 p-3 text-center text-lg tracking-widest rounded bg-gray-700"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />

            <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold">
              Verify OTP
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-red-400 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
