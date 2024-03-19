import GenericList from "@/src/components/c-crud/generic";
import Header from "@/src/components/c-header/c-header";
import { useEffect, useState } from "react";

export default function User({ token, roles }) {
  const [controllers, setControllers] = useState({});
  const [loading, setLoading] = useState(true);

  
  const refetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/controller`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setControllers(data.controllers);

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
    <>
      <Header roles={roles} />
      <section className="w-FormUser">
      <div className="Cont"> 
        <GenericList
          url="controller"
          title="Lista de Usuarios"
          token={token}
          usersFiltered2={controllers}
          loading={loading}
          refetchData={refetchData}
        /> 
        </div>
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
  const token = userData.token;
  const isAdmin = roles.some((role) => role.name === "admin");

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/safety",
        permanent: false,
      },
    };
  }

  return {
    props: {
      roles,
      token,
    },
  };
}

