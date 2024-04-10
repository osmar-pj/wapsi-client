import GenericList from "@/src/components/c-crud/generic";
import { useMainContext } from "@/src/contexts/Main-context";
import { useEffect, useState } from "react";

export default function Group() {
  const [groupInstrument, setGroupInstrument] = useState({});
  const [loading, setLoading] = useState(true);
  const { authTokens } = useMainContext();

  const refetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/groupInstrument?empresa=${authTokens.empresa}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": true,
        },
      });

      if (response.ok) {
        const data = await response.json();
    
        setGroupInstrument(data);
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchData();
  }, []);

  return (
    <section className="w-FormUser">
      <div className="Cont">
        <GenericList
          url="groupInstrument"
          title="Lista de Agrupados"
          usersFiltered2={groupInstrument}
          loading={loading}
          refetchData={refetchData}
        />
      </div>
    </section>
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
    props: {},
  };
}
