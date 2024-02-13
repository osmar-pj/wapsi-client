import ConexionSocket from "@/src/hooks/ConexionSocket";

let categoriaSafety = "safety";

export default function Safety({ empresa, roles }) {
  return (
    <ConexionSocket
      empresa={empresa}
      roles={roles}
      categoria={categoriaSafety}
    />
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
  const empresa = userData.empresa;
  const roles = userData.roles;
  return {
    props: { empresa, roles },
  };
};
