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
    <div>
      {step === "login" && (
        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button>Login</button>
          {message && <p>{message}</p>}
        </form>
      )}

      {step === "qr" && (
        <div>
          <p>Scan this QR with Google Authenticator</p>
          <img src={qr} alt="QR" />
          <button onClick={() => setStep("otp")}>
            I scanned the QR
          </button>
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp}>
          <input
            placeholder="123456"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
          />
          <button>Verify OTP</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}
