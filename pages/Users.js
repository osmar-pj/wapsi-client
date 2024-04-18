import GenericList from "@/src/components/c-crud/generic";
import { useMainContext } from "@/src/contexts/Main-context";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  const { authTokens } = useMainContext();

  const [loading, setLoading] = useState(true);
  const refetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": authTokens.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data);
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
          url="user"
          title="Lista de Usuarios"
          usersFiltered2={users}
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
