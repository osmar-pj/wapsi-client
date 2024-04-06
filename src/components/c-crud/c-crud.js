import Close from "@/src/Icons/close";
import Plus from "@/src/Icons/plus";
import { useMainContext } from "@/src/contexts/Main-context";
import { useState } from "react";

function Crud(props) {
  const {
    isCreateUser,
    setCreate,
    formData,
    refetchData,
    userToEdit,
    url,
    handleUpdateUser: onUpdateUser,
    handleCreateUser: onCreateUser,
  } = props;

  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const { authTokens} = useMainContext();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isCreateUser) {
      handleCreateUser();
    } else {
      handleUpdateUser();
    }
  };

  const handleCreateUser = async () => {
    console.log(formData);
    if (
      Object.values(formData).some((value) => value === "" || value === null)
    ) {
      console.log("Los datos estan vacios ");
    } else {
      try {
        setButtonClicked(true);
        const response = await fetch(`${process.env.API_URL}/api/v1/${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": authTokens.token,
            "ngrok-skip-browser-warning": true,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.status === true) {
            refetchData();
            setSuccess(true);
            setTimeout(() => {
              setCreate(false);
            }, 2000);
          } else {
            setButtonClicked(false);
            // console.log(data.message);
          }
        } else {
          console.error("Error al crear:", response.statusText);
        }
      } catch (error) {
        setButtonClicked(false);
        console.error("Error en la solicitud:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      setButtonClicked(true);
      const response = await fetch(
        `${process.env.API_URL}/api/v1/${url}/${userToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": authTokens.token,
            "ngrok-skip-browser-warning": true,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      
        if (data.status === true) {
          refetchData();
          setSuccess(true);
          setTimeout(() => {
            setCreate(false);
          }, 1500);
        } else {
          setButtonClicked(false);
          // console.log(data.message);
        }
      } else {
        setButtonClicked(false);
        console.error("Error al actualizar", response.statusText);
      }
    } catch (error) {
      setButtonClicked(false);
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="modalCreate-backg">
      <form
        className="mCreate-content"
        onSubmit={handleSubmit}
        style={{
          userSelect: buttonClicked ? "none" : "auto",
          pointerEvents: buttonClicked ? "none" : "auto",
        }}
      >
        <div className="mC-c-header">
          <div className="mC-h-title">
            <div className="mC-c-title-icon">
              <Plus />
            </div>
            <div className="mC-c-title-text">
              <h3>
                {isCreateUser ? "Crear nuevo elemento" : "Actualizar dato"}
              </h3>
              <h4>
                {isCreateUser
                  ? " Agregar información para un nuevo elemento"
                  : " Modificar información existente"}
              </h4>
            </div>
          </div>
          <span
            onClick={() => setCreate(false)}
            className="mC-h-close"
            type="button"
          >
            <Close/>
          </span>
        </div>
        <div className="mC-c-body">
          <div className="mC-b-imputs-Crud">{props.children}</div>
        </div>
        <div className="mC-c-footer">
          <button
            className="btn-cancel"
            type="button"
            onClick={() => setCreate(false)}
          >
            Cancelar
          </button>

          <button
            className={`btn-acept${
              buttonClicked && !success ? " sending" : ""
            }${success ? " success" : ""}`}
            type="submit"
            disabled={buttonClicked}
            onClick={handleSubmit}
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
                Proceso exitoso
              </>
            ) : isCreateUser ? (
              "Guardar"
            ) : (
              "Actualizar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Crud;
