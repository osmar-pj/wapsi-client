import GenericList from "@/src/components/c-crud/generic";
import Header from "@/src/components/c-header/c-header";
import { useEffect, useState } from "react";

export default function Company({ token, roles }) {
  const [usersFiltered2, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const refetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/empresa`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompany(data);
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
          url="empresa"
          title="Lista de Compañias"
          token={token}
          usersFiltered2={usersFiltered2}
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