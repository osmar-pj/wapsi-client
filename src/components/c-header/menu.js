import { useState, useEffect, useRef } from "react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { useRouter } from "next/router";
import { useMainContext } from "@/src/contexts/Main-context";
import Link from "next/link";
import User from "@/src/Icons/user";
import Cookies from "js-cookie";
import Logout from "@/src/Icons/logout";

export default function Menu() {
  const { authTokens, logout } = useMainContext();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState("");
  const [name, setName] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (authTokens) {
      const userName = authTokens?.user;
      setName(userName);
      const isAdmin =
        authTokens?.roles &&
        authTokens.roles.some((role) => role.name === "admin");
      setIsAdmin(isAdmin);
    }
  }, [authTokens]);

  const router = useRouter();
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

  const handleLogout = () => {
    router.push("/login");
    Cookies.remove("userData");
    localStorage.removeItem("empresa");
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <button
        className="dropdownButton"
        onClick={() => {
          setOpen((prevOpen) => !prevOpen);
         
        }}
        style={open ? { transform: "scale(0.95)" } : {}}
      >
        <User />
        <span> {name} </span>
      </button>

      <AnimatePresence>
        {open && (
          <LazyMotion features={domAnimation}>
            <m.div
              className="dropdownContent"
              ref={dropdownRef}
              initial={{
                scale: 0.7,
                opacity: 0,
                transformOrigin: "top right",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.15,
                  ease: "linear",
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.7,
                transition: {
                  duration: 0.15,
                  ease: "linear",
                },
              }}
              style={{ transformOrigin: "top right" }}
            >
              {routes.map((route) => {
                if (isAdmin || route.vali) {
                  return (
                    <m.li
                      key={route.path}
                      className={
                        router.pathname === route.path ? "sp-acti" : "sp-desact"
                      }
                      style={{ opacity: open ? 1 : 0 }}
                    >
                      <Link onClick={handleLinkClick} href={route.path}>
                        {route.label}
                      </Link>
                    </m.li>
                  );
                }
                return null;
              })}
              <button
                className="Logout"
                onClick={handleLogout}
                style={{ opacity: open ? 1 : 0 }}
              >
                <Logout /> Cerrar sesión
              </button>
            </m.div>
          </LazyMotion>
        )}
      </AnimatePresence>
    </div>
  );
}
