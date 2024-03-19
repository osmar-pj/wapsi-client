import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const MainContext = createContext();

const AUTH_TOKENS_KEY = "NEXT_JS_AUTH";

const getAuthTokensFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const authTokensInLocalStorage =
      window.localStorage.getItem(AUTH_TOKENS_KEY);
    return authTokensInLocalStorage
      ? JSON.parse(authTokensInLocalStorage)
      : null;
  }
  return null;
};

export const MainProvider = ({ globalData, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMenuOpenClass = "is-menu-open";
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(isMenuOpenClass);
      //  document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove(isMenuOpenClass);
      //  document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const [authTokens, setAuthTokens] = useState(getAuthTokensFromLocalStorage());

  const login = useCallback(function (authTokens) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(authTokens));
      setAuthTokens(authTokens);
    }
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/groupInstrument`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setInstruments(data);
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    if (authTokens) {
      fetchInstruments();
    }
  }, [authTokens, fetchInstruments]);

  const value = useMemo(
    () => ({
      login,
      authTokens,
      menuOpen,
      setMenuOpen,
      instruments,
      setInstruments,
      globalData,
      fetchInstruments
    }),
    [
      authTokens,
      login,
      menuOpen,
      setMenuOpen,
      instruments,
      setInstruments,
      globalData,
      fetchInstruments
    ]
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

MainContext.displayName = "MainContext";

export function useMainContext() {
  return useContext(MainContext);
}
