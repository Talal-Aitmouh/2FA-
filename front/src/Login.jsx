import { useState } from "react";
import axios from "axios";

export default function LoginWithOtp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [qr, setQr] = useState("");
  const [step, setStep] = useState("login"); 
  // login | qr | otp
  const [message, setMessage] = useState("");

  // 1️⃣ Register + Generate QR
  const handleGenerateQr = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/generate", {
        email,
        password,
      });

      setQr(res.data.data_url);
      setStep("qr");
      setMessage("Scan QR with Google Authenticator");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error generating QR");
    }
  };

  // 2️⃣ After scanning QR → login
  const handleLogin = (e) => {
    e.preventDefault();
    setStep("otp");
    setMessage("Enter OTP from Authenticator");
  };

  // 3️⃣ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/verify", {
        email,
        token: otp,
      });

      if (res.data.verified) {
        setMessage("✅ Login successful");
        setStep("success");
      } else {
        setMessage("❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          OTP Authentication
        </h1>

        {/* STEP 1: REGISTER */}
        {step === "login" && (
          <form onSubmit={handleGenerateQr}>
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
              Register & Generate QR
            </button>
          </form>
        )}

        {/* STEP 2: QR CODE */}
        {step === "qr" && (
          <div className="text-center">
            <p className="mb-4">Scan this QR code</p>
            <img src={qr} alt="QR Code" className="mx-auto mb-4" />

            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold"
            >
              I have scanned the QR
            </button>
          </div>
        )}

        {/* STEP 3: OTP */}
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

        {/* SUCCESS */}
        {step === "success" && (
          <div className="text-center text-green-500 font-bold text-xl">
            🎉 Authenticated Successfully
          </div>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
}
