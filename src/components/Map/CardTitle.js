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

  return (
    <div className="Home-title">
      <h1>Unidad Minera {empresa}</h1>
      <span>Monitoreo de gases en tiempo real </span>
      <img src="imgs/warning.svg" className="img-warning" alt="" />
    </div>
  );
}
