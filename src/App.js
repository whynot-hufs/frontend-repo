import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboard from "./pages/Onboard";
import Home from "./pages/Home";
import HosInfo from "./pages/HosInfo";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hosinfo" element={<HosInfo />} />
      </Routes>
    </div>
  );
}
