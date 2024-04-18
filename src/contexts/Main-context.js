import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DataGroups } from "../libs/api";

export const MainContext = createContext({
  login: (authTokens) => {},
  logout: () => {},
  isLoggedIn: false,
  authTokens: null,
});

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

export default function MainProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMenuOpenClass = "is-menu-open";
  const [instruments, setInstruments] = useState([]);
  const [authTokens, setAuthTokens] = useState(getAuthTokensFromLocalStorage());

  const login = useCallback(function (authTokens) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(authTokens));
      setAuthTokens(authTokens);
    }
  }, []);

  const logout = useCallback(function () {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKENS_KEY);
      setAuthTokens(null);
    }
  }, []);

  // const fetchInstruments = async () => {
  //   const data = await DataGroups(authTokens.empresa);
  //   setInstruments(data);
  // };

   const fetchInstruments = async () => {
    if (authTokens && authTokens.token) {
      
      const data = await DataGroups(authTokens.token);

      if (data !== null) {
        setInstruments(data);
      }
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, [authTokens]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(isMenuOpenClass);
    } else {
      document.body.classList.remove(isMenuOpenClass);
    }
  }, [menuOpen]);


  const value = useMemo(
    () => ({
      login,
      logout,
      authTokens,
      isLoggedIn: authTokens !== null,
      menuOpen,
      setMenuOpen,
      instruments,
      setInstruments,
      fetchInstruments
    }),
    [
      authTokens,
      login,
      menuOpen,
      setMenuOpen,
      instruments,
      setInstruments,
      fetchInstruments
    ]
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

export function useMainContext() {
  return useContext(MainContext);
}
