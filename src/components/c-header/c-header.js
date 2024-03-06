import User from "@/src/Icons/user";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header({ roles }) {
  const isAdmin = roles.some((role) => role.name === "admin");
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");
    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      const name = userData.name;
      setName(name);
      
      const empresa = userData.empresa;
      if (empresa === "HUARON") {
        setEmpresa("/imgs/logo-Huaron.svg");
      } else {
        setEmpresa("/imgs/buena.svg");
      }
    }
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("userData");
    localStorage.removeItem("empresa");
    window.location.reload();
    router.push("/login");
  };

  const routes = [
    { path: "/safety", label: "SEGURIDAD" },
    // { path: "/ventilation", label: "VENTILACIÓN" },
    // { path: "/operation", label: "OPERACIÓN" },
    // { path: "/ti", label: "TI" },
    { path: "/Analysis", label: "ANÁLISIS" },
  ];

  return (
    <header className="c-header">
      <div className="logo points">
        <div className="square1"></div>
        <div className="square2"></div>
        <img src={empresa} className="Products-banner-desk" alt="" />
      </div>

      <div className="navbar points">
        <div className="square1"></div>
        <div className="square2"></div>
        <ul className="menu">
          {routes.map((route) => (
            <li
              key={route.path}
              className={
                router.pathname === route.path ? "sp-acti" : "sp-desact"
              }
            >
              <Link href={route.path}>{route.label}</Link>
            </li>
          ))}
        </ul>  
      </div>
      <div className="admAvatar points">
        <div className="square1"></div>
        <div className="square2"></div>
        <div>
          <span>WAPSI-SOLUTIONS </span>
        </div>
        <div className="avatar">
          <div className="menu">
            <div className="dropdown">
              <button className="dropdownButton">
                <User /><span> {name} </span>
              </button>
              <div className="dropdownContent">
                <Link href="/Analysis" className="none">
                  <button>Análisis</button>
                </Link>
                <Link href="/safety" className="none">
                  <button>Seguridad</button>
                </Link>
                <Link href="/ti" className="none">
                  <button>TI</button>
                </Link>
                <Link href="/ventilation" className="none">
                  <button>Ventilación</button>
                </Link>
                <Link href="/operation" className="none">
                  <button>Operaciones</button>
                </Link>
                <Link href="/track" className="none">
                  <button>Seguimiento</button>
                </Link>  
                {isAdmin ? (
                  <>
                    <Link href="/Form">
                      <button>Actualizar Modal</button>
                    </Link>
                    <Link href="/Users">
                      <button>Lista de Usuarios</button>
                    </Link>
                    <Link href="/Company">
                      <button>Lista de Empresas</button>
                    </Link>
                    <Link href="/Controller">
                      <button>Lista de Controladores</button>
                    </Link>
                  </>
                ) : null}
                <button className="Logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>        
        </div>
      </div>
    </header>
  );
}
