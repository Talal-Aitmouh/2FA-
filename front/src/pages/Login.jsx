import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getDeviceId } from "../utils/device";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [qr, setQr] = useState("");
  const [step, setStep] = useState("login"); // login | qr | otp
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const deviceId = getDeviceId();


  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/login", {
        email,
        password,
        deviceId
      });

      
      if (res.data.status === "NEW_USER") {
        setQr(res.data.qr);
        setStep("qr");
        return;
      }

     
      if (res.data.otpRequired) {
        setStep("otp");
        return;
      }

      
      if (res.data.status === "LOGGED_IN") {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
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
        deviceId
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Secure Login 🔐
      </h1>

      {/* STEP: LOGIN */}
      {step === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>

          {message && (
            <p className="text-center text-red-400 text-sm">{message}</p>
          )}
        </form>
      )}

      {/* STEP: QR */}
      {step === "qr" && (
        <div className="text-center space-y-4">
          <p className="text-gray-300">
            Scan this QR code with <br />
            <span className="font-semibold text-white">
              Google Authenticator
            </span>
          </p>

          <img
            src={qr}
            alt="QR"
            className="mx-auto bg-white p-2 rounded-lg"
          />

          <button
            onClick={() => setStep("otp")}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            I scanned the QR
          </button>
        </div>
      )}

      {/* STEP: OTP */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            placeholder="123456"
            className="w-full px-4 py-3 text-center tracking-widest text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            Verify OTP
          </button>

          {message && (
            <p className="text-center text-red-400 text-sm">{message}</p>
          )}
        </form>
      )}

    </div>
  </div>
);

}
