import { useEffect, useState } from "react";
import { useMainContext } from "@/src/contexts/Main-context";

export default function CardTitle() {
  const { authTokens } = useMainContext();
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    // Verificar si authTokens está definido antes de acceder a sus propiedades
    if (authTokens && authTokens.empresa) {
      setEmpresa(authTokens.empresa.toUpperCase());
    }
  }, [authTokens]);


  let imageSrc = "/imgs/slogan-DEFAULT.png";

  if (empresa.includes("LUNDIN")) {
    imageSrc = "/imgs/slogan-LUNDING.png";
  } else if (empresa.includes("YUMPAG")) {
    imageSrc = "/imgs/slogan-DEFAULT.png";
  } 

  return (
    <div className="Home-title">
      <h1>Sistema Wapsi Control </h1>
      {/* <h3>{empresa}</h3> */}
      <span>Ubicación en tiempo real </span>
      <img src={imageSrc} className="img-warning" alt="" />
    </div>
  );
}
