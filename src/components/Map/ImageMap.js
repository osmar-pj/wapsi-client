import { useMainContext } from "@/src/contexts/Main-context";
import { useEffect, useState } from "react";

export const ImageMap = () => {
  const { authTokens } = useMainContext();
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    if (authTokens?.empresa) {
      setEmpresa(authTokens.empresa.toUpperCase());
    }
  }, [authTokens]);

  const imageMap = {
    JULCANI: "/imgs/mapJulcani.svg",
    YUMPAG: "/imgs/mapYumpag.svg",
    HUARON: "/imgs/mapHuaron.svg",
    LUNDIN: "/imgs/mapLUNDING.png",
    CONDESTABLE: "/imgs/mapLUNDING.png", 
    UCHUCCHACUA:"/imgs/mapUchucchacua.png"
  };

  let imageSrc = imageMap[empresa] || "/imgs/mapYumpag.svg";

  if (!imageSrc && empresa) {
    imageSrc = Object.keys(imageMap).find((key) => empresa.includes(key)) 
      ? imageMap[empresa] 
      : "/imgs/mapYumpag.svg"; 
  }

  return imageSrc;
};
