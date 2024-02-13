import { useEffect, useState } from "react";
import Popup from "../c-popup/c-popup";
import Reg from "@/src/Icons/reg";

function Crud(props) {
  const {
    isCreateUser,
    setCreate,
    token,
    formData,
    refetchData,
    userToEdit,
    url,
    handleUpdateUser: onUpdateUser,
    handleCreateUser: onCreateUser,
  } = props;

  const [msg, setMsg] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isCreateUser) {
      handleCreateUser();
    } else {
      handleUpdateUser();
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          setMsg(data.message);
          setSuccessModalVisible(true);
          refetchData();
        } else {
          setMsg(data.message);
          console.log(data.message);
        }
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleUpdateUser = async () => {
   
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/${url}/${userToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": token,
            "ngrok-skip-browser-warning": true,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
       
        // setMsg("Éxito");
        setSuccessModalVisible(true);
        refetchData();
        setTimeout(() => {
          setCreate(false)
        }, 2000);
        // if (data.status === true) {
        // } else {
        //   setMsg(data.message);
        //   console.log(data.message);
        // }
      } else {
        console.error("Error al actualizar", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="popupOverlay">
      {successModalVisible ? (
        <Popup
          title="Acción exitosa!"
          message={"Éxito"}
          visible={successModalVisible}
        />
      ) : (
        <div className="popupContent">
          <form onSubmit={handleSubmit}>
            <div className="Form-container">
              <div className="F-c-header">
                <Reg />
                <h2>{isCreateUser ? "Crear usuario" : "Actualizar usuario"}</h2>
                <span
                  className="mC-h-close"
                  type="button"
                  onClick={() => setCreate(false)}
                >
                  &times;
                </span>
              </div>
              <div className="F-c-main">{props.children}</div>
              <div className="F-c-footer">
                <button className="btn-cancel" type="button" onClick={() => setCreate(false)}>
                  Cancelar
                </button>
                <button className="btn-acept" type="submit">
                  {isCreateUser ? "Crear" : "Actualizar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Crud;
