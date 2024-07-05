import { useMainContext } from "@/src/contexts/Main-context";
import { UpdateVentilatorSC } from "@/src/libs/api";

import { useState } from "react";

export default function DetailsVentilatorSC({ sensorData }) {
  const { fetchInstruments, authTokens } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [activeStates, setActiveStates] = useState({});

  const updateValue = async (id, name, value) => {
    setLoading(true);

    let newData = {};
    if (value === 0) {
      newData = {
        start: true,
        stop: false,
      };
    } else if (value === 1) {
      newData = {
        start: false,
        stop: true,
      };
    }

    // console.log(newData);
    try {
      const data = await UpdateVentilatorSC(authTokens.token, newData);
      // console.log(data);
      //   if (data.status === true) {
      //     fetchInstruments();
      //   }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const updateBoton = async (newState) => {
    setLoading(true);

    const newData = {
      isManual: newState,
      start: false,
      stop: true,
    };

   
    try {
      const data = await UpdateVentilatorSC(authTokens.token, newData);
     
      if (data.status === true) {
        fetchInstruments();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="Details-body Container-Ventilador">
      {sensorData &&
        sensorData.groups.map((i) => (
          <div className="C-container" key={i._id}>
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
                  backgroundColor: i.value === 0 ? "red " : "green ",
                }}
              ></div>

              <div className="valor-ventilator">
                {loading ? (
                  <div className="background-loader">
                    <span className="loader"></span>
                  </div>
                ) : (
                  <>
                    <div className="boton-venti">
                      <button
                        className={`btn-mode ${
                          i.mode === "manual" ? "sw-ac" : ""
                        }`}
                        onClick={() => updateBoton(true)}
                      >
                        <span>Manual</span>
                      </button>
                      <button
                        className={`btn-mode ${
                          i.mode === "auto" ? "sw-ac" : ""
                        }`}
                        onClick={() => updateBoton(false)}
                      >
                        <span>Auto</span>
                      </button>
                    </div>
                    {i.mode === "manual" && (
                      <button
                        className={`btn-switch ${
                          activeStates[i.value] ? "b-azul" : ""
                        }`}
                        onClick={() => updateValue(i._id, i.name, i.value)}
                      >
                        <span>
                          {activeStates[i.value] === 0 ? "Apagar" : "Prender"}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
