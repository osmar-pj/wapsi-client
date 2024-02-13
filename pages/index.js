import Reg from "@/src/Icons/reg";
import Popup from "@/src/components/c-popup/c-popup";
import { useRouter } from "next/router";
import { useState } from "react";
import Select from "react-select";

export default function Formu({ userId }) {
  const [area, setArea] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleAreaChange = ({ value }) => {
    setArea(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!area) {
      console.log("Por favor, ingrese una descripción.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ area: area }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setSuccessMessage("Área actualizado");
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessMessage("");
          router.push(`/${area}`);
          setSuccessModalVisible(false);
        }, 3000);
      } else {
        console.error("Error al actualizar recurso:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <section className="w-Home">
      {successModalVisible ? (
        <Popup
          title="Acción exitosa!"
          message={successMessage}
          visible={successModalVisible}
        />
      ) : (
        <div className="Update-area">
          <div className="Content-header">
            <div className="D-title-name">
              <div>
                <Reg />
              </div>
              <h3>Actualizar área |</h3>
              <h4>update</h4>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="form-l">
            <h3>Seleccione el área al que pertenece</h3>
            <div className="select-area">
              <Select
                instanceId="react-select-instance"
                name="period"
                classNamePrefix="custom-select"
                isSearchable={false}
                isClearable={false}
                onChange={handleAreaChange}
                options={[
                  { value: "safety", label: "Seguridad" },
                  { value: "ti", label: "TI" },
                  { value: "ventilation", label: "Ventilación" },
                  { value: "operation", label: "Operaciones" },
                ]}
                placeholder="Seleccione..."
              />
            </div>
            <button type="submit">Guardar</button>
          </form>
        </div>
      )}
    </section>
  );
}

export const getServerSideProps = async (ctx) => {
  const userDataCookie = ctx.req.cookies.userData;
  const isLoggedIn = !!userDataCookie;

  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userData = JSON.parse(userDataCookie);
  const area = userData.area;
  const userId = userData.userId;

  if (typeof area !== "undefined" && area !== "") {
    return {
      redirect: {
        destination: `/${area}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        area: null,
        userId,
      },
    };
  }
};
