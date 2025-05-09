import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Modal from "../components/Modal";
import "./Home.css";
import listening from "../assets/logo_listening.png";
import waiting from "../assets/logo_waiting.png";
import Footer from "../components/Footer";
import thinkingHello from "../assets/logo_thinking.png";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [responseText, setResponseText] = useState("");
  const [showModal, setShowModal] = useState(false);

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

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          const audio = new Audio(url);
          //audio.play();

          // 업로드 요청
          const formData = new FormData();
          formData.append("question_audio", audioBlob, "recording.webm");

          try {
            setIsLoading(true);
            const response = await fetch(
              "/api/pronun/ask-question?use_correction=true",
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log("🟢 응답 결과:", data);
              setAudioUrl(data.audio_url); // Store server audio_url for modal playback
              setResponseText(data.answer);
              setShowModal(true);
            } else {
              console.error("🔴 서버 오류:", response.statusText);
            }
            setIsLoading(false);
          } catch (error) {
            console.error("🚨 네트워크 오류:", error);
            setIsLoading(false);
          }
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
        {isLoading ? (
          <div className="loading-container">
            <button className="mic-button thinking-animation">
              <img
                src={thinkingHello}
                alt="헬로닥 고민 중"
                className="mic-image"
              />
            </button>
            <p className="mic-label">
              헬로닥이 답변을 <br /> 준비중입니다!
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div>
            {audioUrl && (
              <audio
                src={audioUrl}
                autoPlay
                controls
                style={{ width: "100%" }}
              />
            )}
            <p className="modal-text">{responseText}</p>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
