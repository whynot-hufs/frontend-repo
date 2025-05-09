import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const isComplete = (value) => value.trim().length > 1;
  const isValidPhone = (value) => /^010-\d{4}-\d{4}$/.test(value);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">회원가입</h2>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : isSubmitted ? (
          <div className="completion-screen">
            <div className="check-icon">✅</div>
            <h2 className="form-title">회원가입 완료!</h2>
            <p className="completion-message">이제 로그인하러 가볼까요?</p>
            <button className="form-button" onClick={() => navigate("/login")}>
              로그인 화면으로
            </button>
          </div>
        ) : (
          <form className="styled-form" onSubmit={handleSubmit}>
            <div className={`form-group ${isComplete(name) ? "complete" : ""}`}>
              <label>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div
              className={`form-group ${isValidPhone(phone) ? "complete" : ""}`}
            >
              <label>전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                pattern="010-\d{4}-\d{4}"
                required
              />
            </div>

            <button type="submit" className="form-button">
              가입하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
