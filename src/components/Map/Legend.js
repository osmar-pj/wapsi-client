import { useEffect, useState } from "react";
import { useMainContext } from "@/src/contexts/Main-context";
import IconVentilator from "@/src/IconsMap/IconVentilator";
import IconSensor from "@/src/IconsMap/IconSensor";
import IconLed from "@/src/IconsMap/IconLed";


export default function Legend() {
  const { authTokens } = useMainContext();
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    if (authTokens && authTokens.empresa) {
      setEmpresa(authTokens.empresa.toUpperCase());
    }
  }, [authTokens]);

  return (
    <div className="container-legend">
      <h3>Leyenda del Mapa</h3>
      <div className="c-l-icons">
        <div className="icon-item">
          <IconVentilator color={"#0bb97d"} />
          <div className="info-item">
            <h4>Ventilador de 700HP</h4>
            <h5>Modelo Gunjop.EIRL</h5>
          </div>
        </div>
        <div className="icon-item">
          <IconSensor color={"#0bb97d"} />
          <div className="info-item">
            <h4>Sensor de elementos</h4>
            <h5>Modelo Gunjop.EIRL</h5>
          </div>
        </div>
        <div className="icon-item">
          <IconLed color={"#0bb97d"} />
          <div className="info-item">
            <h4>Led tricolor</h4>
            <h5>Modelo Gunjop.EIRL</h5>
          </div>
        </div>
      </div>
      <div className="c-separate"></div>
      <div className="c-l-icons">
        <div className="icon-item">
          <div className="value" style={{ background: "#ff1437" }}></div>
          <div className="info-item">
            <h4>Nivel Danger</h4>
            <h5>Valor por encima del estandar</h5>
          </div>
        </div>
        <div className="icon-item">
          <div className="value" style={{ background: "#fcc939" }}></div>
          <div className="info-item">
            <h4>Nivel Warning</h4>
            <h5>Valor por encima del estandar</h5>
          </div>
        </div>
        <div className="icon-item">
          <div className="value" style={{ background: "#07bf7e" }}></div>
          <div className="info-item">
            <h4>Nivel Success</h4>
            <h5>Valor por encima del estandar</h5>
          </div>
        </div>

        
      </div>
    </div>
  );
}
