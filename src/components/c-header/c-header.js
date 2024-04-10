import User from "@/src/Icons/user";
import { useMainContext } from "@/src/contexts/Main-context";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header() {
  const { authTokens, logout } = useMainContext();
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    if (authTokens) {
      const empresa = authTokens?.empresa;
      if (empresa === "HUARON") {
        setEmpresa("/imgs/logo-Huaron.svg");
      } else {
        setEmpresa("/imgs/buena.svg");
      }
      const userName = authTokens?.user;
      setName(userName);
      const isAdmin =
        authTokens?.roles &&
        authTokens.roles.some((role) => role.name === "admin");
      setIsAdmin(isAdmin);
    }
  }, [authTokens]);

  const routes = [
    { path: "/", label: "Dashboard", vali: true },
    { path: "/Control", label: "Sistema de Control", vali: true },
    { path: "/Analysis", label: "Análisis", vali: true },
    { path: "/Company", label: "Empresas", vali: isAdmin },
    { path: "/Users", label: "Usuarios", vali: isAdmin },
    { path: "/Controller", label: "Controladores", vali: isAdmin },
    { path: "/Instrument", label: "Instrumentos", vali: isAdmin },
    { path: "/Group", label: "Agrupadores", vali: isAdmin },
  ];

  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
    Cookies.remove("userData");
    localStorage.removeItem("empresa");
    logout();
  };
  

  return (
    <header className="c-header">
      <div className="logo">
        <img src={empresa} className="Products-banner-desk" alt="" />
      </div>
      <div className="navbar">
        <ul className="menu">
          {routes.map((route) => {
            // Mostrar la ruta si isAdmin es true o si vali es true
            if (isAdmin || route.vali) {
              return (
                <li
                  key={route.path}
                  className={
                    router.pathname === route.path ? "sp-acti" : "sp-desact"
                  }
                >
                  <Link href={route.path}>{route.label}</Link>
                </li>
              );
            }
            return null; // No mostrar la ruta si isAdmin es false y vali es false
          })}
        </ul>
      </div>
      <div className="admAvatar">
        <div className="avatar">
          <div className="menu">
            <div className="dropdown">
              <button className="dropdownButton">
                <User />
                <span> {name} </span>
              </button>
              <div className="dropdownContent">
                
                <ul>
                  {routes.map((route) => {
                    // Mostrar la ruta si isAdmin es true o si vali es true
                    if (isAdmin || route.vali) {
                      return (
                        <li
                          key={route.path}
                          className={
                            router.pathname === route.path
                              ? "sp-acti"
                              : "sp-desact"
                          }
                        >
                          <Link href={route.path}>{route.label}</Link>
                        </li>
                      );
                    }
                    return null; // No mostrar la ruta si isAdmin es false y vali es false
                  })}
                </ul>

                <button className="Logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
              {/* <div>
               
                 <ul>
                {isAdmin &&
                  adminRoutes.map((route) => (
                    <li key={route.path}>
                      <Link href={route.path}>{route.label}</Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>
        </div>
        <div className="web-name">
          <img
            src="/imgs/logo-wapsi.svg"
            className="Products-banner-desk"
            alt=""
          />
        </div>
      </div>
    </header>
  );
}
