import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

export default function App() {

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/dashboard"
  element={
    isAuthenticated() ? <Dashboard /> : <Navigate to="/" />
  }
/>
      </Routes>
      
    </BrowserRouter>
  );
}
