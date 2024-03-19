import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AUTH_TOKENS_KEY = "NEXT_JS_AUTH";

const getAuthTokensFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const authTokensInLocalStorage = window.localStorage.getItem(AUTH_TOKENS_KEY);
    return authTokensInLocalStorage ? JSON.parse(authTokensInLocalStorage) : null;
  }
  return null;
};

export const AuthContext = createContext({
  login: (authTokens) => {},
  logout: () => {},
  isLoggedIn: false,
  authTokens: null,
});

export function AuthContextProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(getAuthTokensFromLocalStorage());

  const login = useCallback(function (authTokens) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(authTokens));
      setAuthTokens(authTokens);
    }
  }, []);

  const router = useRouter();
  const logout = useCallback(function () {
    if (typeof window !== "undefined") {
      router.push("/login");
      window.localStorage.removeItem(AUTH_TOKENS_KEY);
      setAuthTokens(null);
    }
  }, []);

  const isLoggedIn = useMemo(() => authTokens !== null, [authTokens]);

  const value = useMemo(
    () => ({
      login,
      logout,
      authTokens,
      isLoggedIn,
    }),
    [authTokens, login, logout, isLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
