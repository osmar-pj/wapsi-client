import Reg from "@/src/Icons/reg";
import Header from "@/src/components/c-header/c-header";
import Popup from "@/src/components/c-popup/c-popup";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Form({ roles }) {
  const [descript, setDescript] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setDescript(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!descript) {
      console.log("Por favor, ingrese una descripción.");
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/advertiser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ description: descript }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Recurso actualizado");
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          setSuccessMessage("");
          router.push("/safety");
        }, 3000);
      } else {
        console.error("Error al actualizar recurso:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <Header roles={roles} />
      <section className="w-Home">
      {successModalVisible ? (
        <Popup
          title="Acción exitosa!"
          message={successMessage}
          visible={successModalVisible}
        />
      ) : (
        <div className="content-update">
          <div className="Content-header">
            <div className="D-title-name">
              <div>
                <Reg />
              </div>
              <h3>Actualizar modal |</h3>
              <h4>Ventana emergente</h4>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="update-modal">
            <textarea
              name="descript"
              placeholder="Descripción..."
              cols="30"
              rows="10"
              onChange={handleAreaChange}
              value={descript}
            ></textarea>
            <button type="submit">Actualizar</button>
          </form>
        </div>
      )}
      </section>
    </>
  );
}

export async function getServerSideProps(ctx) {
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
  const roles = userData.roles;
  const isAdmin = roles.some((role) => role.name === "admin");

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      roles,
    },
  };
}
