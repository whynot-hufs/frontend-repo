import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./Home.css";
import listening from "../assets/logo_listening.png";
import waiting from "../assets/logo_waiting.png";
import Footer from "../components/Footer";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          // 자동 재생
          const audio = new Audio(url);
          audio.play();
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("🎤 마이크 권한이 필요합니다.");
        console.error("마이크 접근 실패:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-logo">헬로닥</h1>
      </header>

      <main className="home-main">
        <button
          className={`mic-button ${isRecording ? "recording" : ""}`}
          onClick={handleMicClick}
        >
          <img
            src={isRecording ? listening : waiting}
            alt={isRecording ? "정지 버튼" : "마이크 버튼"}
            className="mic-image"
          />
        </button>
        <p className="mic-label">
          {isRecording ? (
            <>
              듣고 있어요
              <br />
              한번 더 누르면 <br /> 헬로닥이 답변해줄 거예요!
            </>
          ) : (
            <>
              버튼을 누르면 헬로닥과의
              <br />
              상담이 시작돼요
            </>
          )}
        </p>
      </main>

      <Footer />
    </div>
  );
}
