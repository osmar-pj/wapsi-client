import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import Notification from "../w-Notification/Notification";
import Sensor from "../w-Sensor/w-Sensor";
import Graphic from "../w-Graphic/w-Graphic";

const Mventilador = ({ sensorData }) => {
  const { menuOpen, setMenuOpen } = useContext(MainContext);
  const ref = useRef(null);

  const [active, setActive] = useState(sensorData.groups[0].value);
  const [valor, setValor] = useState(false);

  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  if (!sensorData) {
    return null;
  }

  useEffect(() => {
    if (!!menuOpen) {
      ref.current.scrollTo(0, 0);
    }
  }, [menuOpen]);

  const updateValue = async (id, name) => {
    try {
      setActive(!active);

      const requestBody = {
        value: !active,
        name: name,
      };

      const response = await fetch(
        `${process.env.API_URL}/api/v1/bigdata/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.dataSaved.value);
        console.log("correcto");
        if (data.status === true) {
          setValor(data.dataSaved.value);
        } else {
          console.log("correcto");
        }
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleMouseUp = async (id, value) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/bigdata/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(value),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("correcto");
        if (data.status === true) {
        } else {
          console.log("correcto");
        }
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="w-Details">
      <div className="Details-Container D-ventilador">
        <div className="Details-header">
          <h2>{sensorData.ubication}</h2>
        </div>
        <div className="Details-close">
          <span onClick={() => setMenuOpen(!menuOpen)}>&times;</span>
        </div>
        <div className="Details-body Container-Ventilador" ref={ref}>
          {sensorData.groups && sensorData.groups.length > 0 ? (
            sensorData.groups.map((i, index) => {
              return (
                <>
                  <div className="C-Vent-img">
                    <img src="/imgs/img-ventilador.png" alt="" />
                  </div>
                  <div className="C-Vent-info">
                    <div className="c-v-i-title">
                      <h3>{i.name}</h3>
                      <h5>{i.serie}</h5>
                    </div>
                    <div
                      className="valor-st"
                      style={{
                        backgroundColor: valor === 0 ? "red " : "green ",
                      }}
                    ></div>

                    <div>
                      {i.mode === "manual" ? (
                        <button
                          className={`btn-switch ${active ? "b-azul" : ""}`}
                          onClick={() => updateValue(i._id, i.name)}
                        >
                          <span>{active ? "Encendido" : "Prender"}</span>
                        </button>
                      ) : (
                        <span>Modo: {i.mode}</span>
                      )}
                    </div>

                    <div>
                      {i.signal === "analog" ? (
                        <div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={value}
                            onChange={handleChange}
                            onMouseUp={() => handleMouseUp(i._id)} 
                            style={{ width: "100%" }}
                          />
                          <span>{value}</span>
                        </div>
                      ) : (
                        <span>Señal: {i.signal}</span>
                      )}
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <p>Sin Datos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mventilador;
