import { useMainContext } from "@/src/contexts/Main-context";
import { useEffect, useState } from "react";

export const ImageMap = () => {
    const { authTokens } = useMainContext();
    const [empresa, setEmpresa] = useState("");
  
    useEffect(() => {
      if (authTokens && authTokens.empresa) {
        setEmpresa(authTokens.empresa.toUpperCase());
      }
    }, [authTokens]);
  
    const empresaImageMap = {
      JULCANI: "/imgs/mapJulcani.svg",
      YUMPAG: "/imgs/mapYumpag.svg",
      HUARON: "/imgs/mapHuaron.svg",
    };
  
    const imageSrc = empresaImageMap[empresa] || "/imgs/mapYumpag.svg";
    return imageSrc;
  };
  