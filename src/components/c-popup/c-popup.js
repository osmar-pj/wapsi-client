import React from "react";

export default function Popup({ title, message, visible, onClose }) {
  return (
    <div className={`modalContent ${visible ? "modalVisible" : ""}`}>
      <div className="modalHeader">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
      </div>
      <div className="modalBody">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}
