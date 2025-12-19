import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [qr, setQr] = useState("");
  const [step, setStep] = useState("register");
  // register | qr | otp
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 🆕 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", {
        email,
        password
      });

      setQr(res.data.qr);
      setStep("qr");
    } catch (err) {
      setMessage(err.response?.data?.message || "Register error");
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/verify", {
        email,
        token: otp
      });

      if (res.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };
  localStorage.setItem("auth", "true");
navigate("/dashboard");


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register
        </h1>

        {step === "register" && (
          <form onSubmit={handleRegister}>
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

            <button className="w-full bg-blue-600 p-3 rounded font-semibold">
              Register
            </button>
          </form>
        )}

        {step === "qr" && (
          <div className="text-center">
            <p className="mb-4">Scan QR with Google Authenticator</p>
            <img src={qr} className="mx-auto mb-4" />

            <button
              onClick={() => setStep("otp")}
              className="w-full bg-green-600 p-3 rounded font-semibold"
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
              className="w-full mb-4 p-3 text-center rounded bg-gray-700"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />

            <button className="w-full bg-green-600 p-3 rounded font-semibold">
              Verify OTP
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-red-400">{message}</p>
        )}
      </div>
    </div>
  );
}
