import Reg from "@/src/Icons/reg";
import { useState } from "react";

export default function DeleteForm({
  token,
  refetchData,
  setDelet,
  userToDeleteId,
}) {
  const [msg, setMsg] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/${userToDeleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": token,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMsg(data.message);
        setSuccessModalVisible(true);
        refetchData();
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="popupOverlay">
      {successModalVisible ? (
        <div className="popupContent">
          <div className="modalHeader">
            <div className="success-checkmark">
              <div className="check-cont">
                <div className="check-circle"></div>
                <label className="check-icon"></label>
              </div>
            </div>
          </div>
          <div className="modalBody">
            <h3>Éxito</h3>
            <p>{msg}!</p>
          </div>
          <div className="modalBody">
            <button type="button" onClick={() => setDelet(false)}>
              Aceptar
            </button>
          </div>
        </div>
      ) : (
        <div className="popupContent">
          <div className="Form-container">
            <div className="F-c-header">
              <Reg />
              <h2>Eliminar</h2>
              <span
                className="mC-h-close"
                type="button"
                onClick={() => setDelet(false)}
              >
                <img src="imgs/i-close.svg" alt="" />
              </span>
            </div>
            <div className="F-c-main">
              <p>¿Seguro que quieres eliminar de la lista?</p>
            </div>
            <div className="F-c-footer">
              <button
                className="btn-cancel"
                type="button"
                onClick={() => setDelet(false)}
              >
                No
              </button>
              <button
                className="btn-acept"
                type="button"
                onClick={handleDelete}
              >
                Si
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
