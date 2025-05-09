import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "./HosInfo.css";

export default function HosInfo() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        console.error("위치 정보를 가져올 수 없습니다.", err);
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      const dummy = [
        {
          name: "세브란스 병원",
          address: "서울시 서대문구 연세로 50",
          phone: "02-2228-5800",
        },
        {
          name: "서울대병원",
          address: "서울시 종로구 대학로 101",
          phone: "02-2072-2114",
        },
      ];
      setHospitals(dummy);
    }
  }, [location]);

  return (
    <div className="hosinfo-container">
      <header className="hosinfo-header">
        <h2 className="hosinfo-title">인근 병원 정보</h2>
      </header>

      <main className="hosinfo-main">
        {!location && (
          <p className="hosinfo-loading">위치 정보를 불러오는 중...</p>
        )}
        <ul className="hosinfo-list">
          {hospitals.map((hos, idx) => (
            <li key={idx} className="hosinfo-item">
              <strong className="hosinfo-name">{hos.name}</strong>
              <p className="hosinfo-address">{hos.address}</p>
              <p className="hosinfo-phone">
                <a href={`tel:${hos.phone}`} className="hosinfo-phone-link">
                  {hos.phone}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
