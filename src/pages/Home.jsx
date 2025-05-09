// ✅ 전체 Home.jsx 수정본 (병원 추천 모달 포함 + 버튼)

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import "./Home.css";
import listening from "../assets/logo_listening.png";
import waiting from "../assets/logo_waiting.png";
import Footer from "../components/Footer";
import thinkingHello from "../assets/logo_thinking.png";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [visibleText, setVisibleText] = useState("");
  const [hospitalNames, setHospitalNames] = useState([]);
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const modalTextRef = useRef(null);

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) =>
          audioChunksRef.current.push(e.data);

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          const formData = new FormData();
          formData.append("question_audio", audioBlob, "recording.webm");

          try {
            setIsLoading(true);
            const response = await fetch(
              "http://52.78.70.45:8000/api/pronun/ask-question?use_correction=true",
              { method: "POST", body: formData }
            );

            if (response.ok) {
              const data = await response.json();
              console.log(data);
              setAudioUrl(data.audio_url);
              setResponseText(data.answer);
              setHospitalNames(data.hospitals || []);
              setShowModal(true);
            } else {
              console.error("서버 오류:", response.statusText);
            }
            setIsLoading(false);
          } catch (err) {
            console.error("네트워크 오류:", err);
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

  useEffect(() => {
    if (showModal && responseText && audioUrl) {
      const sentences = responseText
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0);
      setVisibleText("");
      let index = 0;

      const showNextSentence = () => {
        if (index >= sentences.length) return;
        const current = sentences[index];
        setVisibleText((prev) => (prev ? `${prev} ${current}` : current));
        setTimeout(() => {
          if (modalTextRef.current) {
            modalTextRef.current.scrollTop = modalTextRef.current.scrollHeight;
          }
        }, 100);

        const delay = Math.min(7000, Math.max(1500, current.length * 105));
        index++;
        setTimeout(showNextSentence, delay);
      };
      setTimeout(showNextSentence, 300);
    }
  }, [showModal, responseText, audioUrl]);

  useEffect(() => {
    if (hospitalNames.length > 0 && location) {
      const fetchHospitals = async () => {
        const serviceKey = "ZHKI97SA-ZHKI-ZHKI-ZHKI-ZHKI97SAYP";
        const dutyDivs = ["A", "B", "C", "D", "E"];
        const matched = [];

        for (const div of dutyDivs) {
          const url = `https://safemap.go.kr/openApiService/data/getGenralHospitalData.do?serviceKey=${serviceKey}&pageNo=1&numOfRows=500&dataType=XML&DutyDiv=${div}`;
          const res = await fetch(url);
          let text = await res.text();
          text = text.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g, "&amp;");
          const xmlDoc = new DOMParser().parseFromString(
            text,
            "application/xml"
          );
          const items = xmlDoc.getElementsByTagName("item");

          for (let i = 0; i < items.length; i++) {
            const normalize = (str) =>
              str
                ?.toLowerCase()
                .replace(/\s/g, "")
                .replace(/\(.*?\)/g, "")
                .trim();

            const hospitalSet = new Set(hospitalNames.map(normalize));

            const name =
              items[i].getElementsByTagName("DUTYNAME")[0]?.textContent;
            const address =
              items[i].getElementsByTagName("DUTYADDR")[0]?.textContent;

            if (hospitalSet.has(normalize(name)) && address?.includes("용인")) {
              matched.push({
                name,
                address,
                phone:
                  items[i].getElementsByTagName("DUTYTEL1")[0]?.textContent,
                open:
                  items[i].getElementsByTagName("DUTYTIME1S")[0]?.textContent ||
                  "미등록",
              });
            }
          }
        }

        setHospitalDetails(matched);
        //setShowHospitalModal(true);
      };
      fetchHospitals();
    }
  }, [hospitalNames, location]);

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
                  한번 더 누르면 <br />
                  헬로닥이 답변해줄 거예요!
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
                src={`http://52.78.70.45:8000${audioUrl}`}
                autoPlay
                controls
                style={{ width: "100%", marginBottom: "1rem" }}
              />
            )}
            <p className="modal-text" ref={modalTextRef}>
              {visibleText.split(" ").map((word, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  {word}&nbsp;
                </span>
              ))}
            </p>
            <div className="modal-actions">
              <button
                className="modal-button"
                onClick={() => setShowModal(false)}
              >
                닫기
              </button>
              <button
                className="modal-button"
                onClick={() => {
                  setShowModal(false);
                  setShowHospitalModal(true);
                }}
              >
                추천 병원 보기
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showHospitalModal && (
        <Modal onClose={() => setShowHospitalModal(false)}>
          <div className="modal-hospital-container">
            <h3 className="modal-hospital-title">추천 병원</h3>
            {hospitalDetails.map((hos, idx) => (
              <div key={idx} className="modal-hospital-item">
                <div className="modal-hospital-name">{hos.name}</div>
                <div className="modal-hospital-address">
                  주소: {hos.address}
                </div>
                <div className="modal-hospital-phone">
                  전화: <a href={`tel:${hos.phone}`}>{hos.phone}</a>
                </div>
                <div className="modal-hospital-time">
                  개원 시간: {hos.open?.slice(0, 2)}:{hos.open?.slice(2, 4)}
                </div>
              </div>
            ))}

            {/* ✅ 닫기 버튼 명확히 추가 */}
            <div className="modal-actions">
              <button
                className="modal-button"
                onClick={() => setShowHospitalModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
