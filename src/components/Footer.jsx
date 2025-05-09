import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="home-footer">
      <button
        className={`footer-btn ${isActive("/home") ? "active" : ""}`}
        onClick={() => navigate("/home")}
      >
        홈
      </button>
      <button
        className={`footer-btn ${isActive("/hosinfo") ? "active" : ""}`}
        onClick={() => navigate("/hosinfo")}
      >
        인근 병원
      </button>
    </footer>
  );
}
