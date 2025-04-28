import { useMainContext } from "@/src/contexts/Main-context";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Menu from "./menu";

export default function Header() {
  const { authTokens } = useMainContext();
  const [empresa, setEmpresa] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    if (authTokens) {
      const empresa = authTokens?.empresa;
      if (empresa === "HUARON") {
        setEmpresa("/imgs/logo-Huaron.svg");
      } else if (empresa.includes("LUNDIN")) {
        setEmpresa("/imgs/logo-LUNDING.png");
      } else if (empresa.includes("CONDESTABLE")) {
        setEmpresa("/imgs/logo-CONDESTABLE.png");
      } else {
        setEmpresa("/imgs/logo-buena.svg");
      }

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

  return (
    <header className="c-header">
      <div className="logo">
        <Link href="/">
        <img src={empresa} className="Products-banner-desk" alt="" />
        </Link> 
      </div>
      <div className="navbar">
        <ul className="menu">
          {routes.map((route) => {
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
            return null;
          })}
        </ul>
      </div>
      <div className="admAvatar">
        <div className="web-name">
          <img
            src="/imgs/logo-wapsi.svg"
            className="Products-banner-desk"
            alt=""
          />
        </div>
        <div className="avatar">
          <div className="menu">
            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
}
