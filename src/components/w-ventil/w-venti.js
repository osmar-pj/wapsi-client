import { useMainContext } from "@/src/contexts/Main-context";
import { UpdateVentilator } from "@/src/libs/api";
import { useRef, useState } from "react";

const Mventilador = ({ selectedSensorId }) => {
  const { instruments, fetchInstruments, menuOpen, setMenuOpen } =
    useMainContext();

  const [loading, setLoading] = useState(false);
  const [activeStates, setActiveStates] = useState({});
  const [valueStates, setValueStates] = useState({});

  const filteredInstrument =
    instruments.find((instrument) => instrument._id === selectedSensorId._id)
      ?.groups || [];

  const ref = useRef(null);

  if (!selectedSensorId) {
    return null;
  }
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
      if (data?.status === true) {
        fetchInstruments();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

   

    // const newValue = parseFloat(event.target.value);
    setValueStates((prevStates) => ({
      ...prevStates,
      [id]: newValue,
    }));
  };

  return (
    <div className="w-Details D-ventilador">
      <div className="Details-header">
        <h2>
          <strong>{selectedSensorId.ubication}</strong>
          <small> /Ubicación</small>
        </h2>
      </div>
      <div className="Details-close">
        <span onClick={() => setMenuOpen(!menuOpen)}>&times;</span>
      </div>
      <div className="Details-body Container-Ventilador" ref={ref}>
        {filteredInstrument.map((i) => (
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
                            activeStates[i._id] ? "b-azul" : ""
                          }`}
                          onClick={() => updateValue(i._id, i.name)}
                        >
                          <span>
                            {activeStates[i._id] ? "Encendido" : "Prender"}
                          </span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mventilador;
