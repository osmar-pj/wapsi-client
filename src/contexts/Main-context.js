import React, { createContext, useEffect, useState } from "react";

export const MainContext = createContext();

export const MainProvider = ({ globalData, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMenuOpenClass = "is-menu-open";
  const [controllers, setControllers] = useState([]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(isMenuOpenClass);
      //  document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove(isMenuOpenClass);
      //  document.body.style.overflow = "auto";
    }
  }, [menuOpen]);
 
  return (  
    <MainContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        controllers,
        setControllers,
        globalData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainContext.displayName = "MainContext";
