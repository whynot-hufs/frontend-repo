// src/components/Modal.jsx
import "./Modal.css";

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫힘 방지
      >
        {children}
      </div>
    </div>
  );
}
