import { useMainContext } from "@/src/contexts/Main-context";
import { UpdateInstrument, UpdateVentilator } from "@/src/libs/api";
import { useState } from "react";

export default function DetailsVentilator({ sensorData }) {
  const { fetchInstruments, authTokens } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [activeStates, setActiveStates] = useState({});
  const [valueStates, setValueStates] = useState({});

  const updateValue = async (id, name) => {
    setLoading(true);
    const newActive = !activeStates[id];
    setActiveStates((prevStates) => ({
      ...prevStates,
      [id]: newActive,
    }));

    const newData = {
      value: newActive,
      name: name,
    };

    try {
      const data = await UpdateVentilator(id, newData);
      console.log(data.instrument.value);
      if (data?.status === true) {
        fetchInstruments();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 10000);
    }
  };

  const handleMouseUp = async (select) => {
    setLoading(true);
    const newData = { value: select.value };
    try {
      const data = await UpdateVentilator(select.id, newData);
      if (data.status === true) {
        fetchInstruments();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleInputChange = (event, id) => {
    const newValue = parseInt(event.target.value);
    setValueStates((prevStates) => ({
      ...prevStates,
      [id]: newValue,
    }));
  };

  const updateMode = async (id, currentMode) => {
    setLoading(true);
    const newMode = currentMode === "auto" ? "manual" : "auto";
    try {
      const data = await UpdateInstrument(authTokens.token, id, {
        mode: newMode,
      });

      if (data.status === true) {
        fetchInstruments();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  console.log(sensorData);

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
                <h3>VENTILADOR</h3>
                <div className="t-ventil">
                  <h4 className="">V-210</h4>
                  <h5 className="serie">{i.serie}</h5>
                </div>
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
                    {i.mode === "auto" && i.signal === "digital" ? (
                      <>
                        <div className="value-text">
                          {i.value === 0 ? "OFF" : "ON"}
                        </div>
                        <div className="value-secun">
                          <h5>
                            Modo/ <strong> {i.mode}</strong>
                          </h5>
                          <h5>
                            Señal/ <strong>{i.signal}</strong>
                          </h5>
                        </div>
                      </>
                    ) : i.mode === "auto" && i.signal === "analog" ? (
                      <>
                        <div className="value-secun">
                          <h5>
                            Modo/ <strong> {i.mode}</strong>
                          </h5>
                          <h5>
                            Señal/ <strong>{i.signal}</strong>
                          </h5>
                        </div>
                        <div className="value-porcen">
                          <div>
                            <h2>{i.value}%</h2>
                            <h3>rot.</h3>
                          </div>
                          <div></div>
                        </div>
                      </>
                    ) : i.mode === "manual" && i.signal === "digital" ? (
                      <>
                        <button
                          className={`btn-switch ${
                            i.value === 1 ? "b-azul" : ""
                          }`}
                          onClick={() => updateValue(i._id, i.name)}
                          disabled={
                            authTokens &&
                            authTokens.roles &&
                            authTokens.roles.length > 0 &&
                            authTokens.roles[0].name === "moderator"
                              ? false
                              : true
                          }
                        >
                          <span>{i.value === 1 ? "Encendido" : "Prender"}</span>
                        </button>
                      </>
                    ) : i.mode === "manual" && i.signal === "analog" ? (
                      <div className="value-slider">
                        <span className="slider-num">
                          {valueStates[i._id] || i.value}%
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={valueStates[i._id] || i.value}
                          onChange={(event) => handleInputChange(event, i._id)}
                          onMouseUp={() =>
                            handleMouseUp({
                              id: i._id,
                              value:
                                valueStates[i._id] !== undefined
                                  ? valueStates[i._id]
                                  : 0,
                            })
                          }
                          style={{ padding: "0", cursor: "pointer" }}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {/* <div className="">{i.value === 0 ? "apagado " : "prendido "}
              {message}{i.value}
              </div> */}
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
                      onClick={() => updateMode(i._id, i.mode)}
                      disabled={
                        authTokens &&
                        authTokens.roles &&
                        authTokens.roles.length > 0 &&
                        authTokens.roles[0].name === "moderator"
                          ? false
                          : true
                      }
                    >
                      <span>Manual</span>
                    </button>
                    <button
                      className={`btn-mode ${i.mode === "auto" ? "sw-ac" : ""}`}
                      onClick={() => updateMode(i._id, i.mode)}
                      disabled={
                        authTokens &&
                        authTokens.roles &&
                        authTokens.roles.length > 0 &&
                        authTokens.roles[0].name === "moderator"
                          ? false
                          : true
                      }
                    >
                      <span>Auto</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
