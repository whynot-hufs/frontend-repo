import { useNavigate } from "react-router-dom";
import "./Onboard.css";
import logo from "../assets/LOGO3.png";

export default function Onboard() {
  const navigate = useNavigate();

  return (
    <div className="onboard-container">
      <div className="onboard-overlay">
        <img src={logo} alt="헬로닥 로고" className="onboard-logo" />
        <div className="onboard-buttons">
          <button
            className="onboard-btn-outline"
            onClick={() => navigate("/login")}
          >
            로그인하기
          </button>
          <button
            className="onboard-btn-filled"
            onClick={() => navigate("/signup")}
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
}
