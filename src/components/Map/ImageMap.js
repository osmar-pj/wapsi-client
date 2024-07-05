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

  let imageSrc = "/imgs/mapYumpag.svg";

  if (empresa.includes("JULCANI")) {
    imageSrc = "/imgs/mapJulcani.svg";
  } else if (empresa.includes("YUMPAG")) {
    imageSrc = "/imgs/mapYumpag.svg";
  } else if (empresa.includes("HUARON")) {
    imageSrc = "/imgs/mapHuaron.svg";
  } else if (empresa.includes("LUNDIN")) {
    imageSrc = "/imgs/mapLUNDING.png";
  }

  return imageSrc;
};
