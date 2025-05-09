import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "./HosInfo.css";

export default function HosInfo() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ 추가

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
      const fetchHospitals = async () => {
        setIsLoading(true); // ✅ 병원 정보 로딩 시작
        const serviceKey = "ZHKI97SA-ZHKI-ZHKI-ZHKI-ZHKI97SAYP";
        const url = `https://safemap.go.kr/openApiService/data/getGenralHospitalData.do?serviceKey=${serviceKey}&pageNo=1&numOfRows=500&dataType=XML&DutyDiv=A`;

        try {
          const res = await fetch(url);
          let text = await res.text();
          text = text.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g, "&amp;");
          const parser = new window.DOMParser();
          const xmlDoc = parser.parseFromString(text, "application/xml");
          const items = xmlDoc.getElementsByTagName("item");

          const result = [];

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.getElementsByTagName("DUTYNAME")[0]?.textContent;
            const address =
              item.getElementsByTagName("DUTYADDR")[0]?.textContent;
            const phone = item.getElementsByTagName("DUTYTEL1")[0]?.textContent;
            const lat = parseFloat(
              item.getElementsByTagName("LAT")[0]?.textContent
            );
            const lon = parseFloat(
              item.getElementsByTagName("LON")[0]?.textContent
            );

            if (!lat || !lon) continue;

            const toRad = (v) => (v * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(lat - location.latitude);
            const dLon = toRad(lon - location.longitude);
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(location.latitude)) *
                Math.cos(toRad(lat)) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            if (distance <= 5) {
              result.push({ name, address, phone });
            }
          }

          setHospitals(result);
        } catch (err) {
          console.error("종합병원 데이터 불러오기 실패:", err);
        } finally {
          setIsLoading(false); // ✅ 병원 정보 로딩 완료
        }
      };

      fetchHospitals();
    }
  }, [location]);

  return (
    <div className="hosinfo-container">
      <header className="hosinfo-header">
        <h2 className="hosinfo-title">인근 병원 정보</h2>
      </header>

      <main className="hosinfo-main">
        {!location || isLoading ? (
          <p className="hosinfo-loading">위치 정보를 불러오는 중...</p>
        ) : hospitals.length === 0 ? (
          <p className="hosinfo-no-result">인근에 병원이 없습니다.</p>
        ) : (
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
        )}
      </main>
      <Footer />
    </div>
  );
}
