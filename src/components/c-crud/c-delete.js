import Close from "@/src/Icons/close";
import Delete from "@/src/Icons/delete";
import { useMainContext } from "@/src/contexts/Main-context";
import { useState } from "react";

export default function DeleteForm({ refetchData, setDelet, userToDeleteId }) {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const { authTokens } = useMainContext();

  const handleDelete = async () => {
    try {
      setButtonClicked(true);
      const response = await fetch(
        `${process.env.API_URL}/api/v1/${userToDeleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": authTokens.token,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
    
        if (data.status === true) {
          refetchData();
          setSuccess(true);
          setTimeout(() => {
            setDelet(false);
          }, 1000);
        } else {
          setButtonClicked(false);
        }
      } else {
        setButtonClicked(false);
        console.error("Error al obtener datos:", response.statusText);
      }
    } catch (error) {
      setButtonClicked(false);
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="modalCreate-backg">
      <div
        className="mCreate-content mC-Delete "
        style={{
          userSelect: buttonClicked ? "none" : "auto",
          pointerEvents: buttonClicked ? "none" : "auto",
        }}
      >
        <div className="mC-c-header">
          <div className="mC-h-title">
            <div className="mC-c-title-icon">
              <Delete />{" "}
            </div>
            <div className="mC-c-title-text">
              <h3>Eliminar </h3>
              <h4>Remover dato seleccionado</h4>
            </div>
          </div>
          <span
            onClick={() => setDelet(false)}
            className="mC-h-close"
            type="button"
          >
            <Close />
          </span>
        </div>

        <div className="mC-c-body">
          <p>¿Seguro que quieres eliminar de la lista?</p>
        </div>
        <div className="mC-c-footer">
          <button
            className="btn-cancel"
            type="button"
            onClick={() => setDelet(false)}
          >
            No
          </button>

          <button
            className={`btn-acept${
              buttonClicked && !success ? " sending" : ""
            }${success ? " success" : ""}`}
            type="submit"
            disabled={buttonClicked}
            onClick={handleDelete}
          >
            {buttonClicked && !success ? (
              <>
                <span className="loader"></span>Enviando...
              </>
            ) : success ? (
              <>
                <div className="checkbox-wrapper">
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      className="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      className="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
                Éxito...
              </>
            ) : (
              "Si"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// <div className="F-c-footer">
//             <button
//               className="btn-cancel"
//               type="button"
//               onClick={() => setDelet(false)}
//             >
//               No
//             </button>
//             <button className="btn-acept" type="button" onClick={handleDelete}>
//               Si
//             </button>
//           </div>
