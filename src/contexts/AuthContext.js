import { createContext, useContext, useReducer, useEffect } from 'react';
// import { parseCookies, setCookie, destroyCookie } from 'cookies'; // Para gestionar cookies en Next.js

const initialState = {
  name: 'Juan',
  user: null,
  dataList: [],
};

const AuthContext = createContext();

// Tipos de acciones
const actionTypes = {
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  GET_LIST: 'GET_LIST',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.AUTH_LOGIN:
      return { ...state, user: action.payload };
    case actionTypes.AUTH_LOGOUT:
      return { ...state, user: null };
    case actionTypes.GET_LIST:
      return { ...state, dataList: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authLogin = (payload) => {
    dispatch({ type: actionTypes.AUTH_LOGIN, payload });
  };

  const authLogout = () => {
    dispatch({ type: actionTypes.AUTH_LOGOUT });
  };

  const getList = (payload) => {
    dispatch({ type: actionTypes.GET_LIST, payload });
  };

//   useEffect(() => {
//     // Recuperar datos del usuario desde cookies al inicio
//     const { user } = parseCookies();
//     if (user) {
//       authLogin(JSON.parse(user));
//     }
//   }, []);

  return (
    <AuthContext.Provider value={{ state, authLogin, authLogout, getList }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
